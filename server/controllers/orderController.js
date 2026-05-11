const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Notification = require('../models/Notification');
const ApiError = require('../utils/apiError');
const ApiResponse = require('../utils/apiResponse');
const emailService = require('../services/emailService');

const createOrder = async (req, res, next) => {
  try {
    const { shippingAddress, paymentMethod, notes } = req.body;

    if (!shippingAddress || !shippingAddress.street || !shippingAddress.city || !shippingAddress.country) {
      throw ApiError.badRequest('Shipping address with street, city, and country is required');
    }

    if (paymentMethod && !['stripe', 'cod'].includes(paymentMethod)) {
      throw ApiError.badRequest('Payment method must be either "stripe" or "cod"');
    }

    const cart = await Cart.findOne({ user: req.user._id }).populate({
      path: 'items.product',
      populate: { path: 'vendor', select: '_id' }
    });

    if (!cart || cart.items.length === 0) {
      throw ApiError.badRequest('Cart is empty');
    }

    const orderItems = [];
    let subtotal = 0;

    for (const item of cart.items) {
      const product = item.product;

      if (!product) {
        throw ApiError.badRequest('One or more products in your cart no longer exist');
      }

      if (!product.isApproved || !product.isActive) {
        throw ApiError.badRequest(`Product "${product.title}" is no longer available`);
      }

      if (product.stockQuantity < item.quantity) {
        throw ApiError.badRequest(
          `Insufficient stock for "${product.title}". Available: ${product.stockQuantity}`
        );
      }

      if (!product.vendor) {
        throw ApiError.badRequest(`Vendor missing for "${product.title}"`);
      }

      const primaryImage = product.images.find((img) => img.isPrimary);
      const image = primaryImage
        ? primaryImage.url
        : product.images[0]
        ? product.images[0].url
        : '';

      orderItems.push({
        product: product._id,
        vendor: product.vendor?._id || product.vendor,
        title: product.title,
        image,
        price: product.price,
        quantity: item.quantity,
      });

      subtotal += product.price * item.quantity;
    }

    const shippingFee = subtotal > 5000 ? 0 : 200;
    const discount = 0;
    const totalAmount = subtotal + shippingFee - discount;

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      paymentMethod: paymentMethod || 'stripe',
      subtotal,
      shippingFee,
      discount,
      totalAmount,
      notes: notes || '',
    });

    cart.items = [];
    await cart.save();

    const vendorIds = [...new Set(orderItems.map((item) => item.vendor.toString()))];

    const notificationPromises = vendorIds.map((vendorId) =>
      Notification.create({
        user: vendorId,
        title: 'New Order Received',
        message: `You have a new order #${order._id.toString().slice(-8)}`,
        type: 'order',
        link: `/seller/orders/${order._id}`,
      })
    );

    await Promise.all(notificationPromises);

    if (paymentMethod === 'cod') {
      const inventoryUpdates = orderItems.map((item) =>
        Product.findByIdAndUpdate(item.product, {
          $inc: { stockQuantity: -item.quantity, totalSold: item.quantity },
        })
      );
      await Promise.all(inventoryUpdates);
    }

    try {
      await emailService.sendOrderConfirmation(req.user.email, order);
    } catch (emailError) {
      console.error('Failed to send order confirmation email:', emailError.message);
    }

    return ApiResponse.created(res, { order }, 'Order created successfully');
  } catch (error) {
    next(error);
  }
};

const getMyOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const pageNum  = Math.max(1, parseInt(page));
    const limitNum = Math.max(1, Math.min(50, parseInt(limit)));
    const skip     = (pageNum - 1) * limitNum;

    const filter = { user: req.user._id };

    // ✅ Apply status filter when provided
    if (status) {
      filter.status = status;
    }

    const [orders, total] = await Promise.all([
      Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      Order.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limitNum);

    return ApiResponse.success(
      res,
      {
        orders,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages,
          hasNextPage: pageNum < totalPages,
          hasPrevPage: pageNum > 1,
        },
      },
      'Orders retrieved successfully'
    );
  } catch (error) {
    next(error);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id).populate('user', 'fullName email');

    if (!order) {
      throw ApiError.notFound('Order not found');
    }

    const isOwner = order.user._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      throw ApiError.forbidden('You are not authorized to view this order');
    }

    return ApiResponse.success(res, { order }, 'Order retrieved successfully');
  } catch (error) {
    next(error);
  }
};

const cancelOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { cancelReason } = req.body;

    const order = await Order.findById(id);

    if (!order) {
      throw ApiError.notFound('Order not found');
    }

    if (order.user.toString() !== req.user._id.toString()) {
      throw ApiError.forbidden('You are not authorized to cancel this order');
    }

    if (order.status !== 'pending') {
      throw ApiError.badRequest('Only pending orders can be cancelled');
    }

    order.status = 'cancelled';
    order.cancelReason = cancelReason || '';
    await order.save();

    if (order.paymentMethod === 'cod') {
      const inventoryUpdates = order.items.map((item) =>
        Product.findByIdAndUpdate(item.product, {
          $inc: { stockQuantity: item.quantity, totalSold: -item.quantity },
        })
      );
      await Promise.all(inventoryUpdates);
    }

    return ApiResponse.success(res, { order }, 'Order cancelled successfully');
  } catch (error) {
    next(error);
  }
};

const getSellerOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const pageNum  = Math.max(1, parseInt(page));
    const limitNum = Math.max(1, Math.min(50, parseInt(limit)));
    const skip     = (pageNum - 1) * limitNum;

    const filter = { 'items.vendor': req.user._id };

    if (status) {
      filter.status = status;
    }

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .populate('user', 'fullName email'),
      Order.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limitNum);

    const ordersWithMethod = orders.map((order) => ({
      ...order.toObject(),
      paymentMethod: order.paymentMethod || 'cod',
    }));

    return ApiResponse.success(
      res,
      {
        orders: ordersWithMethod,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages,
          hasNextPage: pageNum < totalPages,
          hasPrevPage: pageNum > 1,
        },
      },
      'Seller orders retrieved successfully'
    );
  } catch (error) {
    next(error);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['confirmed', 'packed', 'shipped', 'delivered', 'cancelled'];

    if (!status || !validStatuses.includes(status)) {
      throw ApiError.badRequest(`Status must be one of: ${validStatuses.join(', ')}`);
    }

    const order = await Order.findById(id).populate('user', 'fullName email');

    console.log('Updating order:', order.paymentMethod, status);

    if (!order) {
      throw ApiError.notFound('Order not found');
    }

    const sellerHasItems = order.items.some(
      (item) => item.vendor.toString() === req.user._id.toString()
    );

    if (!sellerHasItems) {
      throw ApiError.forbidden('You are not authorized to update this order');
    }

    order.status = status;

    if (status === 'delivered') {
      order.deliveredAt = new Date();

      if (order.paymentMethod === 'cod' || order.paymentMethod === 'stripe') {
        order.paymentStatus = 'paid';
        order.markModified('paymentStatus');
      }
    }

    await order.save();

    try {
      await emailService.sendOrderStatusUpdate(order.user.email, order._id, status);
    } catch (emailError) {
      console.error('Failed to send status update email:', emailError.message);
    }

    await Notification.create({
      user: order.user._id,
      title: 'Order Status Updated',
      message: `Your order #${order._id.toString().slice(-8)} has been updated to "${status}"`,
      type: 'order',
      link: `/orders/${order._id}`,
    });

    return ApiResponse.success(res, { order }, 'Order status updated successfully');
  } catch (error) {
    next(error);
  }
};

// ✅ NEW: Returns the user's delivered orders that contain the given product.
// Used by ReviewSubmissionForm so users can select which order they're reviewing.
const getEligibleOrdersForReview = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const orders = await Order.find({
      user: req.user._id,
      status: 'delivered',
      'items.product': productId,
    })
      .sort({ createdAt: -1 })
      .select('_id createdAt items');

    return ApiResponse.success(res, { orders }, 'Eligible orders retrieved');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getSellerOrders,
  updateOrderStatus,
  getEligibleOrdersForReview, // ✅ export
};