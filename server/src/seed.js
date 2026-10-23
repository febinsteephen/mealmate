const mongoose = require('mongoose');
const dotenv = require('dotenv');
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

    // Common password for all demo accounts
    const defaultPassword = 'password123';

    // 1. Create Sample Hotels & Restaurants
    const hotel1 = await User.create({
      name: 'Faizal Rahman',
      email: 'hotel.mandhimanzil@example.com',
      password: defaultPassword,
      role: 'hotel',
      organizationName: 'Mandhi Manzil',
      phone: '9847112233'
    });

    const hotel2 = await User.create({
      name: 'Mohammed Rizwan',
      email: 'hotel.paradise@example.com',
      password: defaultPassword,
      role: 'hotel',
      organizationName: 'Paradise Restaurant',
      phone: '9847223344'
    });

    const hotel3 = await User.create({
      name: 'Suresh Kumar',
      email: 'hotel.malabar@example.com',
      password: defaultPassword,
      role: 'hotel',
      organizationName: 'Hotel Grand Malabar',
      phone: '9847012345'
    });

    const hotel4 = await User.create({
      name: 'Venkatesh Iyer',
      email: 'hotel.aryas@example.com',
      password: defaultPassword,
      role: 'hotel',
      organizationName: 'Aryaas Veg Restaurant',
      phone: '9847123456'
    });

    const hotel5 = await User.create({
      name: 'Shankar Pillai',
      email: 'hotel.annapoorna@example.com',
      password: defaultPassword,
      role: 'hotel',
      organizationName: 'Annapoorna Caterers & Bakes',
      phone: '9847556677'
    });

    // 2. Create Sample Donation Camps, Orphanages, and Old Age Homes
    const camp1 = await User.create({
      name: 'Sister Mary',
      email: 'camp.wayanad@example.com',
      password: defaultPassword,
      role: 'camp',
      organizationName: 'Wayanad Flood Relief Camp #1',
      phone: '9447011223'
    });

    const camp2 = await User.create({
      name: 'Father George',
      email: 'camp.snehabhavan@example.com',
      password: defaultPassword,
      role: 'camp',
      organizationName: 'Snehabhavan Orphanage & Children Home',
      phone: '9447223311'
    });

    const camp3 = await User.create({
      name: 'Anil Varma',
      email: 'camp.karuna@example.com',
      password: defaultPassword,
      role: 'camp',
      organizationName: 'Karuna Vridha Sadanam (Old Age Home)',
      phone: '9447334455'
    });

    const camp4 = await User.create({
      name: 'Dr. Priya Nambiar',
      email: 'camp.stjude@example.com',
      password: defaultPassword,
      role: 'camp',
      organizationName: 'St. Jude Disaster Relief Camp',
      phone: '9447889900'
    });

    const camp5 = await User.create({
      name: 'Geetha Menon',
      email: 'camp.shanti@example.com',
      password: defaultPassword,
      role: 'camp',
      organizationName: 'Shanti Senior Citizen Care Home',
      phone: '9447445566'
    });

    const camp6 = await User.create({
      name: 'Kavitha Nair',
      email: 'camp.asha@example.com',
      password: defaultPassword,
      role: 'camp',
      organizationName: 'Asha Bala Bhavan Orphanage',
      phone: '9447990011'
    });

    // 3. Create Available Food Listings from Various Hotels
    const now = Date.now();

    await FoodListing.create({
      hotel: hotel1._id,
      hotelName: hotel1.organizationName,
      title: '50 Servings Chicken Kuzhimandhi & Mayonnaise',
      description: 'Banquet dinner surplus. Packed in individual hygienic containers with mandi soup and tomato chutney.',
      foodType: 'Non-Veg',
      quantityServings: 50,
      preparedTime: 'Prepared at 1:45 PM',
      expiryTime: new Date(now + 4 * 60 * 60 * 1000), // 4 hours from now
      status: 'available'
    });

    await FoodListing.create({
      hotel: hotel2._id,
      hotelName: hotel2.organizationName,
      title: '40 Plates Hyderabadi Dum Biryani & Raitha',
      description: 'Hot authentic dum biryani from our noon service batch. Suitable for kids or elder dinner.',
      foodType: 'Non-Veg',
      quantityServings: 40,
      preparedTime: 'Lunch Service 1:15 PM',
      expiryTime: new Date(now + 5 * 60 * 60 * 1000),
      status: 'available'
    });

    await FoodListing.create({
      hotel: hotel4._id,
      hotelName: hotel4.organizationName,
      title: '35 Pure Veg Meals (Ghee Rice, Sambar & Dal)',
      description: '100% pure vegetarian lunch catering packets with pickle, papad, and mixed veg kootu.',
      foodType: 'Veg',
      quantityServings: 35,
      preparedTime: 'Prepared at 12:30 PM',
      expiryTime: new Date(now + 6 * 60 * 60 * 1000),
      status: 'available'
    });

    await FoodListing.create({
      hotel: hotel3._id,
      hotelName: hotel3.organizationName,
      title: '60 Kerala Parottas with Chicken & Veg Curry',
      description: 'Fresh parottas packaged in bundles of 5 with separate curry packs.',
      foodType: 'Mixed',
      quantityServings: 60,
      preparedTime: 'Prepared at 2:00 PM',
      expiryTime: new Date(now + 4.5 * 60 * 60 * 1000),
      status: 'available'
    });

    await FoodListing.create({
      hotel: hotel5._id,
      hotelName: hotel5.organizationName,
      title: '70 Snack Boxes (Veg Cutlets, Egg Rolls & Breads)',
      description: 'Fresh evening bakery assortment, excellent for evening tea at shelters or children homes.',
      foodType: 'Mixed',
      quantityServings: 70,
      preparedTime: 'Freshly Baked at 3:00 PM',
      expiryTime: new Date(now + 8 * 60 * 60 * 1000),
      status: 'available'
    });

    await FoodListing.create({
      hotel: hotel1._id,
      hotelName: hotel1.organizationName,
      title: '30 Servings Arabic Mandhi Rice & Grilled Chicken',
      description: 'Extra catering order safely warm-boxed. Ready for immediate pickup.',
      foodType: 'Non-Veg',
      quantityServings: 30,
      preparedTime: 'Prepared at 2:30 PM',
      expiryTime: new Date(now + 3 * 60 * 60 * 1000),
      status: 'available'
    });

    // 4. Create a sample already-claimed order for demo tracking
    const claimedListing = await FoodListing.create({
      hotel: hotel3._id,
      hotelName: hotel3.organizationName,
      title: '30 Meal Packets Chapati & Veg Stew',
      description: 'Morning breakfast batch safely preserved.',
      foodType: 'Veg',
      quantityServings: 30,
      preparedTime: 'Morning 9:30 AM',
      expiryTime: new Date(now + 2 * 60 * 60 * 1000),
      status: 'claimed'
    });

    await Order.create({
      foodListing: claimedListing._id,
      hotel: hotel3._id,
      hotelName: hotel3.organizationName,
      hotelPhone: hotel3.phone,
      camp: camp2._id,
      campName: camp2.organizationName,
      campPhone: camp2.phone,
      foodCost: 0,
      deliveryFee: 200,
      totalAmount: 200,
      paymentMethod: 'online',
      paymentStatus: 'paid',
      orderStatus: 'picked_up',
      specialNotes: 'Deliver to main gate reception of Snehabhavan Orphanage'
    });

    console.log('----------------------------------------------------');
    console.log('✅ Sample Data Seeded Successfully!');
    console.log('Password for ALL accounts: password123');
    console.log('----------------------------------------------------');
    console.log('HOTELS & RESTAURANTS:');
    console.log('  1. Mandhi Manzil:         hotel.mandhimanzil@example.com');
    console.log('  2. Paradise Restaurant:    hotel.paradise@example.com');
    console.log('  3. Hotel Grand Malabar:    hotel.malabar@example.com');
    console.log('  4. Aryaas Veg Restaurant:  hotel.aryas@example.com');
    console.log('  5. Annapoorna Caterers:    hotel.annapoorna@example.com');
    console.log('');
    console.log('CAMPS, ORPHANAGES & OLD AGE HOMES:');
    console.log('  1. Wayanad Relief Camp:    camp.wayanad@example.com');
    console.log('  2. Snehabhavan Orphanage:  camp.snehabhavan@example.com');
    console.log('  3. Karuna Old Age Home:    camp.karuna@example.com');
    console.log('  4. St. Jude Relief Camp:   camp.stjude@example.com');
    console.log('  5. Shanti Senior Care:     camp.shanti@example.com');
    console.log('  6. Asha Bala Bhavan:       camp.asha@example.com');
    console.log('----------------------------------------------------');

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error.message);
    process.exit(1);
  }
};

seedData();
