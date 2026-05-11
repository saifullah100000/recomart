const Order = require('../models/Order');
const Product = require('../models/Product');
const Wishlist = require('../models/Wishlist');

class RecommendationService {
  async getForYou(userId) {
    const recentOrders = await Order.find({ user: userId })
      .sort({ createdAt: -1 }).limit(10).populate('items.product');

    const purchasedCategories = [...new Set(
      recentOrders.flatMap(o => o.items.map(i => i.product?.category?.toString())).filter(Boolean)
    )];
    const purchasedProductIds = recentOrders.flatMap(o => o.items.map(i => i.product?._id)).filter(Boolean);

    const wishlist = await Wishlist.findOne({ user: userId }).populate('products');
    const wishlistCategories = wishlist?.products?.map(p => p.category?.toString()).filter(Boolean) || [];

    const preferredCategories = [...new Set([...purchasedCategories, ...wishlistCategories])];

    if (preferredCategories.length === 0) {
      return Product.find({ isApproved: true, isActive: true, stockQuantity: { $gt: 0 } })
        .sort({ rating: -1, totalSold: -1 })
        .limit(20)
        .populate('category', 'name slug');
    }

    return Product.find({
      category: { $in: preferredCategories },
      _id: { $nin: purchasedProductIds },
      isApproved: true,
      isActive: true,
      stockQuantity: { $gt: 0 }
    })
      .sort({ rating: -1, totalSold: -1 })
      .limit(20)
      .populate('category', 'name slug');
  }

  async getSimilar(productId) {
    const product = await Product.findById(productId);
    if (!product) return [];

    const priceMin = product.price * 0.7;
    const priceMax = product.price * 1.3;

    return Product.find({
      _id: { $ne: productId },
      category: product.category,
      price: { $gte: priceMin, $lte: priceMax },
      isApproved: true,
      isActive: true,
      stockQuantity: { $gt: 0 }
    })
      .sort({ rating: -1, totalSold: -1 })
      .limit(10)
      .populate('category', 'name slug');
  }

  async getTrending() {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const trendingIds = await Order.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo }, status: { $ne: 'cancelled' } } },
      { $unwind: '$items' },
      { $group: { _id: '$items.product', soldCount: { $sum: '$items.quantity' } } },
      { $sort: { soldCount: -1 } },
      { $limit: 20 }
    ]);

    if (trendingIds.length === 0) {
      return Product.find({ isApproved: true, isActive: true })
        .sort({ totalSold: -1, rating: -1 })
        .limit(20)
        .populate('category', 'name slug');
    }

    const productIds = trendingIds.map(t => t._id);
    return Product.find({ _id: { $in: productIds }, isApproved: true, isActive: true })
      .populate('category', 'name slug');
  }
}

module.exports = new RecommendationService();
