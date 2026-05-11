const User = require('../models/User');
const VendorProfile = require('../models/VendorProfile');
const Product = require('../models/Product');
const Order = require('../models/Order');
const ApiError = require('../utils/apiError');
const ApiResponse = require('../utils/apiResponse');

const registerSeller = async (req, res, next) => {
  try {
    const { businessName, shopDescription, bankDetails } = req.body;

    if (!businessName) {
      throw ApiError.badRequest('Business name is required');
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      throw ApiError.notFound('User not found');
    }

    if (user.role === 'seller') {
      throw ApiError.conflict('You are already registered as a seller');
    }

    const existingProfile = await VendorProfile.findOne({ user: user._id });
    if (existingProfile) {
      throw ApiError.conflict('Seller application already submitted');
    }

    user.role = 'seller';
    await user.save();

    const profile = await VendorProfile.create({
      user: user._id,
      businessName,
      shopDescription: shopDescription || '',
      bankDetails: bankDetails || {},
      status: 'pending'
    });

    return ApiResponse.created(res, { profile }, 'Seller registration submitted successfully');
  } catch (error) {
    next(error);
  }
};

const getDashboard = async (req, res, next) => {
  try {
    const vendorId = req.user._id;

    const [
      totalProducts,
      pendingProducts,
      approvedProducts,
      orders,
      recentOrders,
      pendingOrders
    ] = await Promise.all([

      Product.countDocuments({
        vendor: vendorId
      }),

      Product.countDocuments({
        vendor: vendorId,
        isApproved: false
      }),

      Product.countDocuments({
        vendor: vendorId,
        isApproved: true
      }),

      // ✅ GET ORDERS
      Order.find({
        'items.vendor': vendorId,
        status: { $ne: 'cancelled' }
      }),

      Order.find({
        'items.vendor': vendorId
      })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('user', 'fullName email'),

      // ✅ FIXED PENDING ORDERS
      Order.countDocuments({
        'items.vendor': vendorId,
        status: 'pending'
      })
    ]);

    // ✅ FIXED REVENUE LOGIC
    let totalRevenue = 0;

    const uniqueOrders = new Set();

    for (const order of orders) {

      uniqueOrders.add(order._id.toString());

      const orderRevenue =
        order.items
          .filter(
            item =>
              item.vendor.toString() ===
              vendorId.toString()
          )
          .reduce(
            (sum, item) =>
              sum +
              (item.price * item.quantity),
            0
          );

      // ✅ COD REVENUE
      if (
        order.paymentMethod === 'cod' &&
        order.status === 'delivered'
      ) {

        totalRevenue += orderRevenue;
      }

      // ✅ STRIPE / ONLINE REVENUE
      else if (
        order.paymentMethod === 'stripe' &&
        (
          order.isPaid === true ||
          order.paymentStatus === 'paid' ||
          order.status === 'confirmed' ||
          order.status === 'delivered'
        )
      ) {

        totalRevenue += orderRevenue;
      }
    }

    const stats = {
      totalOrders: uniqueOrders.size,
      totalRevenue
    };

    return ApiResponse.success(res, {
      totalProducts,
      pendingProducts,
      approvedProducts,
      totalOrders: stats.totalOrders,
      totalRevenue: stats.totalRevenue,

      // ✅ FIXED
      pendingOrders,

      recentOrders
    }, 'Dashboard data retrieved successfully');

  } catch (error) {
    next(error);
  }
};
const getAnalytics = async (req, res, next) => {
  try {
    const vendorId = req.user._id;

    const twelveMonthsAgo = new Date();

    twelveMonthsAgo.setMonth(
      twelveMonthsAgo.getMonth() - 12
    );

    const [
      salesByMonth,
      topProducts,
      revenueByCategory
    ] = await Promise.all([

      // MONTHLY SALES FIX
      Order.aggregate([

        { $unwind: '$items' },

        {
          $match: {
            'items.vendor': vendorId,
            status: 'delivered',
            createdAt: {
              $gte: twelveMonthsAgo
            }
          }
        },

        {
          $group: {

            _id: {
              year: {
                $year: '$createdAt'
              },

              month: {
                $month: '$createdAt'
              }
            },

            revenue: {
              $sum: {
                $multiply: [
                  '$items.price',
                  '$items.quantity'
                ]
              }
            },

            orders: {
              $addToSet: '$_id'
            }
          }
        },

        {
          $project: {

            _id: 1,

            revenue: 1,

            orderCount: {
              $size: '$orders'
            }
          }
        },

        {
          $sort: {
            '_id.year': 1,
            '_id.month': 1
          }
        }
      ]),

      // TOP PRODUCTS FIX
      Order.aggregate([

        { $unwind: '$items' },

        {
          $match: {
            'items.vendor': vendorId,
            status: 'delivered'
          }
        },

        {
          $group: {

            _id: '$items.product',

            title: {
              $first: '$items.title'
            },

            totalSold: {
              $sum: '$items.quantity'
            },

            totalRevenue: {
              $sum: {
                $multiply: [
                  '$items.price',
                  '$items.quantity'
                ]
              }
            }
          }
        },

        {
          $sort: {
            totalSold: -1
          }
        },

        {
          $limit: 5
        }
      ]),

      Order.aggregate([

        { $unwind: '$items' },

        {
          $match: {
            'items.vendor': vendorId,
            status: {
              $ne: 'cancelled'
            }
          }
        },

        {
          $lookup: {
            from: 'products',
            localField: 'items.product',
            foreignField: '_id',
            as: 'productInfo'
          }
        },

        {
          $unwind: '$productInfo'
        },

        {
          $lookup: {
            from: 'categories',
            localField: 'productInfo.category',
            foreignField: '_id',
            as: 'categoryInfo'
          }
        },

        {
          $unwind: '$categoryInfo'
        },

        {
          $group: {

            _id: '$categoryInfo._id',

            category: {
              $first: '$categoryInfo.name'
            },

            revenue: {
              $sum: {
                $multiply: [
                  '$items.price',
                  '$items.quantity'
                ]
              }
            }
          }
        },

        {
          $sort: {
            revenue: -1
          }
        }
      ])
    ]);

    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec'
    ];

    const monthlySales =
      salesByMonth.map(item => ({

        month:
          monthNames[
            item._id.month - 1
          ],

        revenue: item.revenue,

        orders: item.orderCount
      }));

    return ApiResponse.success(res, {

      monthlySales,

      topProducts,

      revenueByCategory

    }, 'Analytics retrieved successfully');

  } catch (error) {

    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const {
      businessName,
      shopDescription,
      shopLogo,
      shopBanner,
      bankDetails
    } = req.body;

    const profile =
      await VendorProfile.findOne({
        user: req.user._id
      });

    if (!profile) {
      throw ApiError.notFound(
        'Vendor profile not found'
      );
    }

    if (businessName !== undefined)
      profile.businessName =
        businessName;

    if (shopDescription !== undefined)
      profile.shopDescription =
        shopDescription;

    if (shopLogo !== undefined)
      profile.shopLogo =
        shopLogo;

    if (shopBanner !== undefined)
      profile.shopBanner =
        shopBanner;

    if (bankDetails !== undefined)
      profile.bankDetails =
        bankDetails;

    await profile.save();

    return ApiResponse.success(
      res,
      { profile },
      'Profile updated successfully'
    );

  } catch (error) {

    next(error);
  }
};

const getPublicStore = async (
  req,
  res,
  next
) => {

  try {

    const { vendorId } =
      req.params;

    const page =
      parseInt(req.query.page) || 1;

    const limit =
      parseInt(req.query.limit) || 12;

    const skip =
      (page - 1) * limit;

    const profile =
      await VendorProfile.findOne({
        user: vendorId
      })

        .populate(
          'user',
          'fullName avatar createdAt'
        );

    if (!profile) {

      throw ApiError.notFound(
        'Store not found'
      );
    }

    const [
      products,
      totalProducts
    ] = await Promise.all([

      Product.find({

        vendor: vendorId,

        isApproved: true,

        isActive: true
      })

        .sort({
          createdAt: -1
        })

        .skip(skip)

        .limit(limit)

        .populate(
          'category',
          'name slug'
        ),

      Product.countDocuments({

        vendor: vendorId,

        isApproved: true,

        isActive: true
      })
    ]);

    return ApiResponse.success(

      res,

      {
        store: profile,

        products,

        pagination: {
          page,
          limit,
          totalProducts,

          totalPages:
            Math.ceil(
              totalProducts / limit
            )
        }
      },

      'Store retrieved successfully'
    );

  } catch (error) {

    next(error);
  }
};

module.exports = {
  registerSeller,
  getDashboard,
  getAnalytics,
  updateProfile,
  getPublicStore
};