const FoodListing = require('../models/FoodListing');

// @desc    Create new surplus food listing
// @route   POST /api/listings
// @access  Private (Hotel only)
const createListing = async (req, res, next) => {
  try {
    const { title, description, foodType, quantityServings, preparedTime, expiryHours } = req.body;

    if (!title || !quantityServings) {
      return res.status(400).json({
        success: false,
        message: 'Please provide food title and number of servings'
      });
    }

    // Expiry time calculation: default to 4 hours from now if not explicitly passed
    const hours = Number(expiryHours) || 4;
    const expiryTime = new Date(Date.now() + hours * 60 * 60 * 1000);

    const listing = await FoodListing.create({
      hotel: req.user._id,
      hotelName: req.user.organizationName, // Captured from registered hotel name
      title,
      description: description || '',
      foodType: foodType || 'Veg',
      quantityServings: Number(quantityServings),
      preparedTime: preparedTime || 'Freshly prepared today',
      expiryTime,
      status: 'available'
    });

    res.status(201).json({
      success: true,
      data: listing
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all available food listings (for Camps to browse)
// @route   GET /api/listings
// @access  Public or Private (Camp)
const getAvailableListings = async (req, res, next) => {
  try {
    const { foodType, search } = req.query;

    const query = {
      status: 'available',
      expiryTime: { $gt: new Date() } // Only show food that has not expired
    };

    if (foodType && foodType !== 'All') {
      query.foodType = foodType;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { hotelName: { $regex: search, $options: 'i' } }
      ];
    }

    const listings = await FoodListing.find(query)
      .sort({ createdAt: -1 })
      .populate('hotel', 'name email phone');

    res.status(200).json({
      success: true,
      count: listings.length,
      data: listings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get listings created by the logged in hotel
// @route   GET /api/listings/my-listings
// @access  Private (Hotel only)
const getMyHotelListings = async (req, res, next) => {
  try {
    const listings = await FoodListing.find({ hotel: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: listings.length,
      data: listings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single food listing by ID
// @route   GET /api/listings/:id
// @access  Public
const getListingById = async (req, res, next) => {
  try {
    const listing = await FoodListing.findById(req.params.id).populate('hotel', 'name email phone organizationName');

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Food listing not found'
      });
    }

    res.status(200).json({
      success: true,
      data: listing
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete food listing
// @route   DELETE /api/listings/:id
// @access  Private (Hotel only - owner check)
const deleteListing = async (req, res, next) => {
  try {
    const listing = await FoodListing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Food listing not found'
      });
    }

    // Ownership check
    if (listing.hotel.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this listing'
      });
    }

    await listing.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Listing deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createListing,
  getAvailableListings,
  getMyHotelListings,
  getListingById,
  deleteListing
};
