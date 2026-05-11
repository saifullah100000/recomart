const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const validate = require('../middleware/validate');
const { productValidators } = require('../utils/validators');
const productController = require('../controllers/productController');

// Public routes
router.get('/', productController.getProducts);

// Seller routes (must come before /:slug to avoid slug conflict)
router.get('/seller/my-products', auth, roleCheck('seller'), productController.getSellerProducts);

// Public routes with params
router.get('/:slug', productController.getProductBySlug);
router.get('/category/:categorySlug', productController.getProductsByCategory);

// Protected seller routes
router.post('/', auth, roleCheck('seller'), productValidators.create, validate, productController.createProduct);
router.put('/:id', auth, roleCheck('seller'), productValidators.update, validate, productController.updateProduct);
router.delete('/:id', auth, roleCheck('seller'), productController.deleteProduct);

module.exports = router;
