const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { userValidators } = require('../utils/validators');
const userController = require('../controllers/userController');

router.use(auth);

router.put('/profile', userValidators.updateProfile, validate, userController.updateProfile);
router.put('/password', userValidators.changePassword, validate, userController.changePassword);

// ✅ FIX 1: ADD GET ADDRESSES (required by frontend)
router.get('/addresses', userController.getAddresses);

// ✅ FIX 2: CHANGE /address → /addresses (match frontend)
router.post('/addresses', userValidators.address, validate, userController.addAddress);

router.put('/address/:addressId', userValidators.address, validate, userController.updateAddress);
router.delete('/address/:addressId', userController.deleteAddress);

module.exports = router;