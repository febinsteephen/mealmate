const mongoose = require('mongoose');

const foodListingSchema = new mongoose.Schema(
  {
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    // Captured directly so frontend can display without extra populate queries
    hotelName: {
      type: String,
      required: [true, 'Hotel / Shop name is required'],
      trim: true
    },
    title: {
      type: String,
      required: [true, 'Please provide a food title (e.g. 40 Plates Biryani)'],
      trim: true
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    foodType: {
      type: String,
      enum: ['Veg', 'Non-Veg', 'Mixed'],
      default: 'Veg'
    },
    quantityServings: {
      type: Number,
      required: [true, 'Please specify approximate number of servings / plates'],
      min: [1, 'Quantity must be at least 1']
    },
    preparedTime: {
      type: String,
      default: 'Freshly Prepared Today'
    },
    expiryTime: {
      type: Date,
      required: [true, 'Please specify deadline time for claiming / pickup']
    },
    status: {
      type: String,
      enum: ['available', 'claimed', 'completed', 'cancelled'],
      default: 'available'
    }
  },
  {
    timestamps: true
  }
);

// Index for quick querying of available listings sorted by recent
foodListingSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('FoodListing', foodListingSchema);
