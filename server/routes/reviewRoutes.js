const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { reviewValidators } = require('../utils/validators');
const reviewController = require('../controllers/reviewController');

// Public
router.get('/product/:productId', reviewController.getProductReviews);

// Protected
router.post('/:productId', auth, reviewValidators.create, validate, reviewController.createReview);
router.delete('/:id', auth, reviewController.deleteReview);

module.exports = router;
