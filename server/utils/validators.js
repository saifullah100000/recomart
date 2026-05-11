const { body, param, query } = require('express-validator');

const authValidators = {
  register: [
    body('fullName').trim().notEmpty().withMessage('Full name is required').isLength({ max: 100 }),
    body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
      .matches(/[A-Z]/).withMessage('Password must contain an uppercase letter')
      .matches(/[0-9]/).withMessage('Password must contain a number'),
    body('role').optional().isIn(['customer', 'seller']).withMessage('Invalid role')
  ],
  login: [
    body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required')
  ],
  refreshToken: [
    body('refreshToken').notEmpty().withMessage('Refresh token is required')
  ]
};

const userValidators = {
  updateProfile: [
    body('fullName').optional().trim().isLength({ max: 100 }),
    body('phone').optional().trim()
  ],
  changePassword: [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword').isLength({ min: 8 }).withMessage('New password must be at least 8 characters')
      .matches(/[A-Z]/).withMessage('Password must contain an uppercase letter')
      .matches(/[0-9]/).withMessage('Password must contain a number')
  ],
  address: [
    body('label').optional().trim(),
    body('street').trim().notEmpty().withMessage('Street is required'),
    body('city').trim().notEmpty().withMessage('City is required'),
    body('state').trim().notEmpty().withMessage('State is required'),
    body('zipCode').trim().notEmpty().withMessage('Zip code is required'),
    body('country').optional().trim()
  ]
};

const productValidators = {
  create: [
    body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 200 }),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('category').notEmpty().withMessage('Category is required').isMongoId(),
    body('stockQuantity').isInt({ min: 0 }).withMessage('Stock quantity must be a non-negative integer'),
    body('compareAtPrice').optional({ nullable: true }).isFloat({ min: 0 }),
    body('brand').optional().trim()
  ],
  update: [
    body('title').optional().trim().isLength({ max: 200 }),
    body('description').optional().trim(),
    body('price').optional().isFloat({ min: 0 }),
    body('category').optional().isMongoId(),
    body('stockQuantity').optional().isInt({ min: 0 }),
    body('compareAtPrice').optional({ nullable: true }).isFloat({ min: 0 }),
    body('brand').optional().trim()
  ]
};

const categoryValidators = {
  create: [
    body('name').trim().notEmpty().withMessage('Category name is required'),
    body('description').optional().trim(),
    body('parent').optional({ nullable: true }).isMongoId()
  ],
  update: [
    body('name').optional().trim(),
    body('description').optional().trim(),
    body('parent').optional({ nullable: true }).isMongoId()
  ]
};

const cartValidators = {
  add: [
    body('productId').notEmpty().withMessage('Product ID is required').isMongoId(),
    body('quantity').optional().isInt({ min: 1 }).withMessage('Quantity must be at least 1')
  ],
  update: [
    body('productId').notEmpty().withMessage('Product ID is required').isMongoId(),
    body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1')
  ]
};

const orderValidators = {
  create: [
    body('shippingAddress.street').trim().notEmpty().withMessage('Street is required'),
    body('shippingAddress.city').trim().notEmpty().withMessage('City is required'),
    body('shippingAddress.state').trim().notEmpty().withMessage('State is required'),
    body('shippingAddress.zipCode').trim().notEmpty().withMessage('Zip code is required'),
    body('shippingAddress.country').trim().notEmpty().withMessage('Country is required'),
    body('shippingAddress.phone').trim().notEmpty().withMessage('Phone is required'),
    body('paymentMethod').isIn(['stripe', 'cod']).withMessage('Invalid payment method')
  ]
};

const reviewValidators = {
  create: [
    body('rating')
      .isInt({ min: 1, max: 5 })
      .withMessage(
        'Rating must be between 1 and 5'
      ),

    body('title')
      .optional()
      .trim()
      .isLength({ max: 100 }),

    body('comment')
      .optional()
      .trim()
      .isLength({ max: 1000 })
  ]
};
const searchValidators = {
  search: [
    query('q').optional().trim(),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 50 })
  ]
};

const chatbotValidators = {
  message: [
    body('message').trim().notEmpty().withMessage('Message is required').isLength({ max: 500 }),
    body('conversationHistory').optional().isArray()
  ]
};

module.exports = {
  authValidators,
  userValidators,
  productValidators,
  categoryValidators,
  cartValidators,
  orderValidators,
  reviewValidators,
  searchValidators,
  chatbotValidators
};
