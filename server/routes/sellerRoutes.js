const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const sellerController = require('../controllers/sellerController');

router.post('/register', auth, sellerController.registerSeller);
router.get('/store/:vendorId', sellerController.getPublicStore);

// Seller-only routes
router.get('/dashboard', auth, roleCheck('seller'), sellerController.getDashboard);
router.get('/analytics', auth, roleCheck('seller'), sellerController.getAnalytics);
router.put('/profile', auth, roleCheck('seller'), sellerController.updateProfile);

module.exports = router;
