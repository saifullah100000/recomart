const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const errorHandler = require('./middleware/errorHandler');
const paymentController = require('./controllers/paymentController');

const app = express();

// ✅ FIX: ensure raw body is preserved for Stripe
app.post(
  '/api/payments/webhook',
  express.raw({ type: 'application/json' }),
  paymentController.handleWebhook
);

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
const visualStyleRoutes =
  require(
    './routes/visualStyleRoutes'
  );

const limiter = rateLimit({

  windowMs:
    15 * 60 * 1000,

  max:
    process.env.NODE_ENV === 'development'
      ? 10000
      : 100,

  message: {

    success: false,

    message:
      'Too many requests, please try again later'
  }
});
app.use('/api/', limiter);

// ✅ FIX: ensure JSON parsing does NOT override webhook raw body
app.use((req, res, next) => {
  if (req.originalUrl === '/api/payments/webhook') {
    return next(); // skip JSON parsing for webhook
  }
  express.json({ limit: '10mb' })(req, res, next);
});

app.use(express.urlencoded({ extended: true }));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/wishlist', require('./routes/wishlistRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/search', require('./routes/searchRoutes'));
app.use('/api/recommendations', require('./routes/recommendationRoutes'));
app.use('/api/chatbot', require('./routes/chatbotRoutes'));
app.use('/api/seller', require('./routes/sellerRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use(
  '/api/visual-style',
  visualStyleRoutes
);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'RecoMart API is running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global error handler
app.use(errorHandler);

module.exports = app;