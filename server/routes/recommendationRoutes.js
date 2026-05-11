const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const recommendationController = require('../controllers/recommendationController');

router.get('/for-you', auth, recommendationController.getForYou);
router.get('/similar/:productId', recommendationController.getSimilar);
router.get('/trending', recommendationController.getTrending);

module.exports = router;
