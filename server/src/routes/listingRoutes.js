const express = require('express');
const router = express.Router();
const {
  createListing,
  getAvailableListings,
  getMyHotelListings,
  getListingById,
  deleteListing,
  resetDemoListings
} = require('../controllers/listingController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public route to view available surplus foods (camps can browse)
router.get('/', getAvailableListings);
router.post('/reset-demo', resetDemoListings);

// Protected routes
router.get('/my-listings', protect, authorize('hotel'), getMyHotelListings);
router.post('/', protect, authorize('hotel'), createListing);
router.get('/:id', getListingById);
router.delete('/:id', protect, authorize('hotel', 'admin'), deleteListing);

module.exports = router;
