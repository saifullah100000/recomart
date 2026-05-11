const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');
const ApiError = require('../utils/apiError');
const ApiResponse = require('../utils/apiResponse');

const getWishlist = async (req, res, next) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id })
      .populate('products', 'title price images slug rating stockQuantity');

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    }

    return ApiResponse.success(res, { wishlist }, 'Wishlist retrieved successfully');
  } catch (error) {
    next(error);
  }
};

const toggleWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      throw ApiError.notFound('Product not found');
    }

    let wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    }

    const productIndex = wishlist.products.findIndex(
      (id) => id.toString() === productId
    );

    let message;
    let isInWishlist;

    if (productIndex > -1) {
      wishlist.products.splice(productIndex, 1);
      message = 'Removed from wishlist';
      isInWishlist = false;
    } else {
      wishlist.products.push(productId);
      message = 'Added to wishlist';
      isInWishlist = true;
    }

    await wishlist.save();

    const updatedWishlist = await Wishlist.findById(wishlist._id)
      .populate('products', 'title price images slug rating stockQuantity');

    return ApiResponse.success(res, {
      wishlist: updatedWishlist,
      isInWishlist
    }, message);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getWishlist,
  toggleWishlist
};
