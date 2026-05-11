const User = require('../models/User');
const VendorProfile = require('../models/VendorProfile');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Payment = require('../models/Payment');
const Category = require('../models/Category');
const ApiError = require('../utils/apiError');
const ApiResponse = require('../utils/apiResponse');
const emailService = require('../services/emailService');
const getDashboard = async (req, res, next) => {
  try {

    const [
      totalUsers,
      totalSellers,
      totalProducts,
      totalOrders,
      revenueAggregation,
      monthlyRevenueRaw,
      pendingSellers,
      pendingProducts,
      recentOrders,
      recentUsers
    ] = await Promise.all([

      User.countDocuments(),

      User.countDocuments({
        role: 'seller'
      }),

      Product.countDocuments(),

      Order.countDocuments(),

      // ✅ FIXED TOTAL REVENUE
      Order.aggregate([

        {
          $match: {

            $or: [

              // COD
              {
                paymentMethod: 'cod',
                status: 'delivered'
              },

              // STRIPE
              {
                paymentMethod: 'stripe',

                $or: [
                  { isPaid: true },
                  { paymentStatus: 'paid' },
                  { status: 'confirmed' },
                  { status: 'delivered' }
                ]
              }
            ]
          }
        },

        {
          $group: {

            _id: null,

            totalRevenue: {
              $sum: '$totalAmount'
            }
          }
        }
      ]),

      // ✅ FIXED MONTHLY REVENUE
      Order.aggregate([

        {
          $match: {

            $or: [

              // COD
              {
                paymentMethod: 'cod',
                status: 'delivered'
              },

              // STRIPE
              {
                paymentMethod: 'stripe',

                $or: [
                  { isPaid: true },
                  { paymentStatus: 'paid' },
                  { status: 'confirmed' },
                  { status: 'delivered' }
                ]
              }
            ]
          }
        },

        {
          $group: {

            _id: {

              month: {
                $month: '$createdAt'
              }
            },

            revenue: {
              $sum: '$totalAmount'
            },

            orders: {
              $sum: 1
            }
          }
        },

        {
          $sort: {
            '_id.month': 1
          }
        }
      ]),

      VendorProfile.countDocuments({
        status: 'pending'
      }),

      Product.countDocuments({
        isApproved: false
      }),

      Order.find()

        .sort({
          createdAt: -1
        })

        .limit(5)

        .populate(
          'user',
          'fullName email'
        ),

      User.find()

        .sort({
          createdAt: -1
        })

        .limit(5)

        .select(
          'fullName email role createdAt isActive'
        )
    ]);

    const totalRevenue =
      revenueAggregation[0]
        ?.totalRevenue || 0;

    // ✅ FORMAT MONTHLY DATA
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

    const monthlyRevenue =
      monthlyRevenueRaw.map(item => ({

        month:
          monthNames[
            item._id.month - 1
          ],

        revenue: item.revenue,

        orders: item.orders
      }));

    return ApiResponse.success(

      res,

      {
        totalUsers,
        totalSellers,
        totalProducts,
        totalOrders,
        totalRevenue,
        monthlyRevenue,
        pendingSellers,
        pendingProducts,
        recentOrders,
        recentUsers
      },

      'Admin dashboard data retrieved successfully'
    );

  } catch (error) {

    next(error);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { role, search } = req.query;

    const filter = {};
    if (role) filter.role = role;
    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const [users, total] = await Promise.all([
      User.find(filter)
        .select('-passwordHash -refreshToken')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      User.countDocuments(filter)
    ]);

    return ApiResponse.success(res, {
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    }, 'Users retrieved successfully');
  } catch (error) {
    next(error);
  }
};

const updateUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== 'boolean') {
      throw ApiError.badRequest('isActive must be a boolean value');
    }

    const user = await User.findById(id);
    if (!user) {
      throw ApiError.notFound('User not found');
    }

    user.isActive = isActive;
    await user.save();

    return ApiResponse.success(res, {
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        isActive: user.isActive
      }
    }, `User ${isActive ? 'activated' : 'deactivated'} successfully`);
  } catch (error) {
    next(error);
  }
};
const getSellers = async (req, res, next) => {
  try {

    const { status } = req.query;

    const filter = {};

    if (status) {
      filter.status = status;
    }

    const sellers =
      await VendorProfile.find(filter)

        .populate(
          'user',
          'fullName email'
        )

        .lean();

   const orders =
  await Order.find({

    $or: [

      // COD
      {
        paymentMethod: 'cod',
        status: 'delivered'
      },

      // STRIPE
      {
        paymentMethod: 'stripe',
        status: 'confirmed'
      },

      {
        paymentMethod: 'stripe',
        status: 'packed'
      },

      {
        paymentMethod: 'stripe',
        status: 'shipped'
      },

      {
        paymentMethod: 'stripe',
        status: 'delivered'
      }
    ]
  });

    const sellersWithStats =
      sellers.map((seller) => {

        let revenue = 0;
        let totalSales = 0;

        orders.forEach((order) => {

          order.items.forEach((item) => {

            if (
              item.vendor &&
              item.vendor.toString() ===
              seller.user._id.toString()
            ) {

              revenue +=
                item.price * item.quantity;

              totalSales +=
                item.quantity;
            }
          });
        });

        return {

          ...seller,

          owner: {
            name:
              seller.user?.fullName || 'N/A'
          },

          revenue,

          totalSales
        };
      });

    return ApiResponse.success(

      res,

      {
        sellers: sellersWithStats
      },

      'Sellers retrieved successfully'
    );

  } catch (error) {

    next(error);
  }
};

const approveSeller = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      throw ApiError.badRequest('Status must be either "approved" or "rejected"');
    }

    const profile = await VendorProfile.findById(id).populate('user', 'fullName email role');
    if (!profile) {
      throw ApiError.notFound('Vendor profile not found');
    }

    profile.status = status;
    await profile.save();

    if (status === 'approved') {
      const user = await User.findById(profile.user._id);
      user.role = 'seller';
      await user.save();
    }

    emailService.sendSellerStatusEmail(
      profile.user.email,
      profile.user.fullName,
      status,
      profile.businessName
    );

    return ApiResponse.success(res, { profile }, `Seller ${status} successfully`);
  } catch (error) {
    next(error);
  }
};

const getProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { isApproved } = req.query;

    const filter = {};
    if (isApproved !== undefined) {
      filter.isApproved = isApproved === 'true';
    }

    const [products, total] = await Promise.all([
      Product.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('vendor', 'fullName email')
        .populate('category', 'name slug'),
      Product.countDocuments(filter)
    ]);

    return ApiResponse.success(res, {
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    }, 'Products retrieved successfully');
  } catch (error) {
    next(error);
  }
};

const approveProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isApproved } = req.body;

    if (typeof isApproved !== 'boolean') {
      throw ApiError.badRequest('isApproved must be a boolean value');
    }

    const product = await Product.findById(id);
    if (!product) {
      throw ApiError.notFound('Product not found');
    }

    product.isApproved = isApproved;
    await product.save();

    return ApiResponse.success(res, { product }, `Product ${isApproved ? 'approved' : 'rejected'} successfully`);
  } catch (error) {
    next(error);
  }
};

const getOrders = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { status } = req.query;

    const filter = {};
    if (status) filter.status = status;

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('user', 'fullName email'),
      Order.countDocuments(filter)
    ]);

    return ApiResponse.success(res, {
      orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    }, 'Orders retrieved successfully');
  } catch (error) {
    next(error);
  }
};
const getReports = async (req, res, next) => {
  try {

    const twelveMonthsAgo = new Date();

    twelveMonthsAgo.setMonth(
      twelveMonthsAgo.getMonth() - 12
    );

    const [
      revenueByMonthRaw,
      userGrowth,
      ordersByStatus,
      topCategories
    ] = await Promise.all([

      // ✅ FIXED REVENUE BY MONTH
      Order.aggregate([

        {
          $match: {

            createdAt: {
              $gte: twelveMonthsAgo
            },

            $or: [

              // COD
              {
                paymentMethod: 'cod',
                status: 'delivered'
              },

              // STRIPE
              {
                paymentMethod: 'stripe',

                $or: [
                  { isPaid: true },
                  { paymentStatus: 'paid' },
                  { status: 'confirmed' },
                  { status: 'delivered' }
                ]
              }
            ]
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
              $sum: '$totalAmount'
            },

            count: {
              $sum: 1
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

      // USER GROWTH
      User.aggregate([

        {
          $match: {
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

            count: {
              $sum: 1
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

      // ORDERS BY STATUS
      Order.aggregate([

        {
          $group: {

            _id: '$status',

            count: {
              $sum: 1
            }
          }
        }
      ]),

      // ✅ FIXED TOP CATEGORIES
      Order.aggregate([

        {
          $match: {

            $or: [

              // COD
              {
                paymentMethod: 'cod',
                status: 'delivered'
              },

              // STRIPE
              {
                paymentMethod: 'stripe',

                $or: [
                  { isPaid: true },
                  { paymentStatus: 'paid' },
                  { status: 'confirmed' },
                  { status: 'delivered' }
                ]
              }
            ]
          }
        },

        {
          $unwind: '$items'
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
            },

            totalSold: {
              $sum: '$items.quantity'
            }
          }
        },

        {
          $sort: {
            revenue: -1
          }
        },

        {
          $limit: 10
        }
      ])
    ]);

    // ✅ FORMAT MONTHS
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

    const revenueByMonth =
      revenueByMonthRaw.map(item => ({

        month:
          monthNames[
            item._id.month - 1
          ],

        revenue: item.revenue,

        orders: item.count
      }));

    return ApiResponse.success(

      res,

      {
        revenueByMonth,
        userGrowth,
        ordersByStatus,
        topCategories
      },

      'Reports generated successfully'
    );

  } catch (error) {

    next(error);
  }
};

module.exports = {
  getDashboard,
  getUsers,
  updateUserStatus,
  getSellers,
  approveSeller,
  getProducts,
  approveProduct,
  getOrders,
  getReports
};