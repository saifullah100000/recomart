const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const validate = require('../middleware/validate');
const { categoryValidators } = require('../utils/validators');
const categoryController = require('../controllers/categoryController');

// Public routes
router.get('/', categoryController.getCategories);
router.get('/:slug', categoryController.getCategoryBySlug);

// Admin routes
router.post('/', auth, roleCheck('admin'), categoryValidators.create, validate, categoryController.createCategory);
router.put('/:id', auth, roleCheck('admin'), categoryValidators.update, validate, categoryController.updateCategory);
router.delete('/:id', auth, roleCheck('admin'), categoryController.deleteCategory);

module.exports = router;
