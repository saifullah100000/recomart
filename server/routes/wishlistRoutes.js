const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const wishlistController = require('../controllers/wishlistController');

router.use(auth);

router.get('/', wishlistController.getWishlist);
router.post('/toggle/:productId', wishlistController.toggleWishlist);

module.exports = router;
