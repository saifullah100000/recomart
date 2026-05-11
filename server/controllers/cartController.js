const Cart = require('../models/Cart');
const Product = require('../models/Product');
const ApiError = require('../utils/apiError');
const ApiResponse = require('../utils/apiResponse');

const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate(
      'items.product',
      'title price images stockQuantity slug'
    );

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    return ApiResponse.success(res, { cart }, 'Cart retrieved successfully');
  } catch (error) {
    next(error);
  }
};

const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      throw ApiError.badRequest('Product ID is required');
    }

    if (quantity < 1) {
      throw ApiError.badRequest('Quantity must be at least 1');
    }

    const product = await Product.findById(productId);
    if (!product) {
      throw ApiError.notFound('Product not found');
    }

    if (!product.isApproved) {
      throw ApiError.badRequest('Product is not available');
    }

    if (!product.isActive) {
      throw ApiError.badRequest('Product is currently inactive');
    }

    if (product.stockQuantity < 1) {
      throw ApiError.badRequest('Product is out of stock');
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [{ product: productId, quantity, priceAtAdd: product.price }]
      });
    } else {
      const existingItemIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId.toString()
      );

      if (existingItemIndex > -1) {
        const newQuantity = cart.items[existingItemIndex].quantity + quantity;

        if (newQuantity > product.stockQuantity) {
          throw ApiError.badRequest(
            `Cannot add more items. Only ${product.stockQuantity} available in stock`
          );
        }

        cart.items[existingItemIndex].quantity = newQuantity;
      } else {
        if (quantity > product.stockQuantity) {
          throw ApiError.badRequest(
            `Requested quantity exceeds available stock (${product.stockQuantity})`
          );
        }

        cart.items.push({
          product: productId,
          quantity,
          priceAtAdd: product.price
        });
      }

      await cart.save();
    }

    cart = await Cart.findById(cart._id).populate(
      'items.product',
      'title price images stockQuantity slug'
    );

    return ApiResponse.success(res, { cart }, 'Item added to cart successfully');
  } catch (error) {
    next(error);
  }
};

const updateQuantity = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId) {
      throw ApiError.badRequest('Product ID is required');
    }

    if (!quantity || quantity < 1) {
      throw ApiError.badRequest('Quantity must be at least 1');
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      throw ApiError.notFound('Cart not found');
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId.toString()
    );

    if (itemIndex === -1) {
      throw ApiError.notFound('Item not found in cart');
    }

    const product = await Product.findById(productId);
    if (!product) {
      throw ApiError.notFound('Product no longer exists');
    }

    if (quantity > product.stockQuantity) {
      throw ApiError.badRequest(
        `Requested quantity exceeds available stock (${product.stockQuantity})`
      );
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate(
      'items.product',
      'title price images stockQuantity slug'
    );

    return ApiResponse.success(res, { cart: updatedCart }, 'Cart updated successfully');
  } catch (error) {
    next(error);
  }
};

const removeFromCart = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      throw ApiError.notFound('Cart not found');
    }

    const itemExists = cart.items.some(
      (item) => item.product.toString() === productId.toString()
    );

    if (!itemExists) {
      throw ApiError.notFound('Item not found in cart');
    }

    cart.items.pull({ product: productId });
    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate(
      'items.product',
      'title price images stockQuantity slug'
    );

    return ApiResponse.success(res, { cart: updatedCart }, 'Item removed from cart');
  } catch (error) {
    next(error);
  }
};

const clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      throw ApiError.notFound('Cart not found');
    }

    cart.items = [];
    await cart.save();

    return ApiResponse.success(res, { cart }, 'Cart cleared successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCart,
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart
};
