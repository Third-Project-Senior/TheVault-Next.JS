const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const {authenticate } = require('../controllers/userController');

// Apply authentication middleware to all routes
router.use(authenticate);

// Create a new order
router.post('/', orderController.createOrder);

// Get all orders
router.get('/', orderController.getOrders);

// Get all orders for a specific user
router.get('/user/:userId', orderController.getUserOrders);

// Get a single order by ID
router.get('/:id', orderController.getOrderById);

// Update order status
router.patch('/:id/status', orderController.updateOrderStatus);

// Update payment status
router.patch('/:id/payment', orderController.updatePaymentStatus);

module.exports = router; 