const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyCampOrders,
  getMyHotelOrders,
  updateOrderStatus
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Camp routes
router.post('/', protect, authorize('camp'), createOrder);
router.get('/my-camp-orders', protect, authorize('camp'), getMyCampOrders);

// Hotel routes
router.get('/my-hotel-orders', protect, authorize('hotel'), getMyHotelOrders);

// Update status (e.g. Hotel confirms pickup or marks delivered)
router.patch('/:id/status', protect, updateOrderStatus);

module.exports = router;
