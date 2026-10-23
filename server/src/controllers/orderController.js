const Order = require('../models/Order');
const FoodListing = require('../models/FoodListing');

// @desc    Place order / claim food listing (Flat ₹200 delivery fee)
// @route   POST /api/orders
// @access  Private (Camp only)
const createOrder = async (req, res, next) => {
  try {
    const { foodListingId, specialNotes, paymentMethod } = req.body;

    if (!foodListingId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide the food listing ID to claim'
      });
    }

    const listing = await FoodListing.findById(foodListingId).populate('hotel', 'phone');

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Food listing not found'
      });
    }

    if (listing.status !== 'available') {
      return res.status(400).json({
        success: false,
        message: 'This food listing has already been claimed or is no longer available'
      });
    }

    // Check expiry
    if (new Date(listing.expiryTime) < new Date()) {
      listing.status = 'expired';
      await listing.save();
      return res.status(400).json({
        success: false,
        message: 'This food listing has passed its expiry window'
      });
    }

    // Fixed 200 INR delivery fee as per business rule
    const FLAT_DELIVERY_FEE = 200;

    const order = await Order.create({
      foodListing: listing._id,
      hotel: listing.hotel._id,
      hotelName: listing.hotelName,
      hotelPhone: listing.hotel.phone || '',
      camp: req.user._id,
      campName: req.user.organizationName, // Captured camp name
      campPhone: req.user.phone,
      foodCost: 0,
      deliveryFee: FLAT_DELIVERY_FEE,
      totalAmount: FLAT_DELIVERY_FEE,
      paymentMethod: paymentMethod || 'online',
      paymentStatus: paymentMethod === 'cash_on_delivery' ? 'cod' : 'paid',
      orderStatus: 'placed',
      specialNotes: specialNotes || ''
    });

    // Mark listing as claimed
    listing.status = 'claimed';
    await listing.save();

    res.status(201).json({
      success: true,
      message: 'Food successfully claimed! Delivery is confirmed for ₹200 flat fee.',
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get orders placed by logged in camp
// @route   GET /api/orders/my-camp-orders
// @access  Private (Camp only)
const getMyCampOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ camp: req.user._id })
      .populate('foodListing', 'title foodType quantityServings expiryTime')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get incoming food orders for the logged in hotel
// @route   GET /api/orders/my-hotel-orders
// @access  Private (Hotel only)
const getMyHotelOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ hotel: req.user._id })
      .populate('foodListing', 'title foodType quantityServings')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order delivery status (placed -> picked_up -> delivered)
// @route   PATCH /api/orders/:id/status
// @access  Private (Hotel, Camp or Admin)
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ['placed', 'picked_up', 'delivered', 'cancelled'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${allowedStatuses.join(', ')}`
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    order.orderStatus = status;
    await order.save();

    // If order completed/delivered, update listing
    if (status === 'delivered') {
      await FoodListing.findByIdAndUpdate(order.foodListing, { status: 'completed' });
    } else if (status === 'cancelled') {
      // Free the food listing back to available
      await FoodListing.findByIdAndUpdate(order.foodListing, { status: 'available' });
    }

    res.status(200).json({
      success: true,
      message: `Order status updated to ${status}`,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getMyCampOrders,
  getMyHotelOrders,
  updateOrderStatus
};
