const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const adminController = require('../controllers/adminController');

router.use(auth);
router.use(roleCheck('admin'));

router.get('/dashboard', adminController.getDashboard);
router.get('/users', adminController.getUsers);
router.put('/users/:id/status', adminController.updateUserStatus);
router.get('/sellers', adminController.getSellers);
router.put('/sellers/:id/approve', adminController.approveSeller);
router.get('/products', adminController.getProducts);
router.put('/products/:id/approve', adminController.approveProduct);
router.get('/orders', adminController.getOrders);
router.get('/reports', adminController.getReports);

module.exports = router;
