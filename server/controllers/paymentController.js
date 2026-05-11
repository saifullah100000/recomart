const Order = require('../models/Order');
const User = require('../models/User');
const ApiError = require('../utils/apiError');
const ApiResponse = require('../utils/apiResponse');
const stripeService = require('../services/stripeService');

const createCheckoutSession = async (req, res, next) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      throw ApiError.badRequest('Order ID is required');
    }

    const order = await Order.findById(orderId);

    if (!order) {
      throw ApiError.notFound('Order not found');
    }

    if (order.user.toString() !== req.user._id.toString()) {
      throw ApiError.forbidden('You are not authorized to pay for this order');
    }

    if (order.paymentStatus !== 'pending') {
      throw ApiError.badRequest('Payment has already been processed for this order');
    }

    const user = await User.findById(req.user._id);
    const session = await stripeService.createCheckoutSession(order, user);

    order.stripeSessionId = session.id;
    await order.save();

    return ApiResponse.success(res, {
      sessionUrl: session.url,
      sessionId: session.id
    }, 'Checkout session created successfully');
  } catch (error) {
    next(error);
  }
};

const handleWebhook = async (req, res, next) => {
  try {
    const sig = req.headers['stripe-signature'];

    if (!sig) {
      throw ApiError.badRequest('Missing Stripe signature');
    }

    await stripeService.handleWebhook(req.body, sig);

    return ApiResponse.success(res, { received: true }, 'Webhook processed');
  } catch (error) {
    next(error);
  }
};

const verifyPayment = async (req, res, next) => {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      throw ApiError.badRequest('Session ID is required');
    }

    const session = await stripeService.verifySession(sessionId);

    const order = await Order.findOne({ stripeSessionId: sessionId });

    if (!order) {
      throw ApiError.notFound('Order not found for this session');
    }

    return ApiResponse.success(res, {
      order: {
        _id: order._id,
        paymentStatus: order.paymentStatus,
        status: order.status,
        totalAmount: order.totalAmount
      }
    }, 'Payment verification completed');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCheckoutSession,
  handleWebhook,
  verifyPayment
};
