const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const FoodListing = require('./models/FoodListing');
const Order = require('./models/Order');

dotenv.config();

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/mealmate';
    await mongoose.connect(mongoUri);
    console.log(`Connected to MongoDB for seeding: ${mongoUri}`);

    // Clear existing data
    await User.deleteMany();
    await FoodListing.deleteMany();
    await Order.deleteMany();
    console.log('Cleared existing database records.');

    // Password for sample accounts: password123
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    // 1. Create Sample Hotels
    const hotel1 = await User.create({
      name: 'Suresh Kumar',
      email: 'hotel.malabar@example.com',
      password: hashedPassword,
      role: 'hotel',
      organizationName: 'Hotel Grand Malabar',
      phone: '9847012345'
    });

    const hotel2 = await User.create({
      name: 'Venkatesh Iyer',
      email: 'hotel.aryas@example.com',
      password: hashedPassword,
      role: 'hotel',
      organizationName: 'Aryaas Veg Restaurant',
      phone: '9847123456'
    });

    // 2. Create Sample Donation Camps
    const camp1 = await User.create({
      name: 'Sister Mary',
      email: 'camp.wayanad@example.com',
      password: hashedPassword,
      role: 'camp',
      organizationName: 'Wayanad Flood Relief Camp #1',
      phone: '9447011223'
    });

    const camp2 = await User.create({
      name: 'Anil Varma',
      email: 'camp.karuna@example.com',
      password: hashedPassword,
      role: 'camp',
      organizationName: 'Karuna Community Shelter',
      phone: '9447334455'
    });

    // 3. Create Sample Surplus Food Listings
    const listing1 = await FoodListing.create({
      hotel: hotel1._id,
      hotelName: hotel1.organizationName,
      title: '45 Plates Chicken Biryani & Salad',
      description: 'Surplus catering batch from banquet hall. Packed in hygienic foil containers.',
      foodType: 'Non-Veg',
      quantityServings: 45,
      preparedTime: 'Lunch Batch 1:30 PM',
      expiryTime: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
      status: 'available'
    });

    const listing2 = await FoodListing.create({
      hotel: hotel2._id,
      hotelName: hotel2.organizationName,
      title: '30 Servings Ghee Rice, Sambar & Dal',
      description: 'Pure vegetarian meal packets prepared for corporate lunch. Fresh and hot.',
      foodType: 'Veg',
      quantityServings: 30,
      preparedTime: 'Prepared at 1:00 PM',
      expiryTime: new Date(Date.now() + 5 * 60 * 60 * 1000), // 5 hours from now
      status: 'available'
    });

    // 4. Create an already claimed sample order for testing
    const listing3 = await FoodListing.create({
      hotel: hotel1._id,
      hotelName: hotel1.organizationName,
      title: '25 Meal Packets Chapati & Curry',
      description: 'Breakfast leftover batch, safely stored.',
      foodType: 'Veg',
      quantityServings: 25,
      preparedTime: 'Morning 10:00 AM',
      expiryTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
      status: 'claimed'
    });

    await Order.create({
      foodListing: listing3._id,
      hotel: hotel1._id,
      hotelName: hotel1.organizationName,
      hotelPhone: hotel1.phone,
      camp: camp1._id,
      campName: camp1.organizationName,
      campPhone: camp1.phone,
      foodCost: 0,
      deliveryFee: 200,
      totalAmount: 200,
      paymentMethod: 'online',
      paymentStatus: 'paid',
      orderStatus: 'picked_up',
      specialNotes: 'Deliver to main camp entrance near medical desk'
    });

    console.log('Sample data seeded successfully!');
    console.log('----------------------------------------------------');
    console.log('Sample Accounts (Password for all: password123):');
    console.log('  Hotel 1: hotel.malabar@example.com (Hotel Grand Malabar)');
    console.log('  Hotel 2: hotel.aryas@example.com (Aryaas Veg Restaurant)');
    console.log('  Camp 1:  camp.wayanad@example.com (Wayanad Flood Relief Camp #1)');
    console.log('  Camp 2:  camp.karuna@example.com (Karuna Community Shelter)');
    console.log('----------------------------------------------------');

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error.message);
    process.exit(1);
  }
};

seedData();
