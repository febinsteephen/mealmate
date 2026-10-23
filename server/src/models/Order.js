const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    foodListing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FoodListing',
      required: true
    },
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    hotelName: {
      type: String,
      required: true
    },
    hotelPhone: {
      type: String,
      default: ''
    },
    camp: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    campName: {
      type: String,
      required: [true, 'Camp / Donation camp name is required']
    },
    campPhone: {
      type: String,
      required: [true, 'Camp contact phone is required']
    },
    // Food item price is strictly zero
    foodCost: {
      type: Number,
      default: 0
    },
    // Flat delivery charge as specified: fixed at 200 INR
    deliveryFee: {
      type: Number,
      default: 200
    },
    totalAmount: {
      type: Number,
      default: 200
    },
    paymentStatus: {
      type: String,
      enum: ['paid', 'pending', 'cod'],
      default: 'paid'
    },
    paymentMethod: {
      type: String,
      enum: ['online', 'cash_on_delivery'],
      default: 'online'
    },
    orderStatus: {
      type: String,
      enum: ['placed', 'picked_up', 'delivered', 'cancelled'],
      default: 'placed'
    },
    specialNotes: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

// Index to quickly look up orders by camp or hotel
orderSchema.index({ camp: 1, createdAt: -1 });
orderSchema.index({ hotel: 1, createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);
