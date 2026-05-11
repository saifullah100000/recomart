const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { cartValidators } = require('../utils/validators');
const cartController = require('../controllers/cartController');

router.use(auth);

router.get('/', cartController.getCart);
router.post('/add', cartValidators.add, validate, cartController.addToCart);
router.put('/update', cartValidators.update, validate, cartController.updateQuantity);
router.delete('/remove/:productId', cartController.removeFromCart);
router.delete('/clear', cartController.clearCart);

module.exports = router;
