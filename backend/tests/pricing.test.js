const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const { calculateBookingPrice } = require('../services/pricingService');
const Category = require('../models/Category');
const Service = require('../models/Service');

dotenv.config({ path: path.join(__dirname, '../.env') });

const runPricingTest = async () => {
  console.log('--- RUNNING EVENTEASE PRICING TEST SUITE ---');

  // If local MongoDB is available connect, or mock data objects
  let dbConnected = false;
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/eventease';
    await mongoose.connect(mongoUri);
    dbConnected = true;
    console.log('[Test] Connected to MongoDB for testing.');
  } catch (err) {
    console.log('[Test] DB connection unavailable, testing with mocked document objects.');
  }

  try {
    let weddingCategory;
    let cateringService;
    let djService;

    if (dbConnected) {
      weddingCategory = await Category.findOne({ name: /Wedding/i });
      cateringService = await Service.findOne({ name: /Catering/i });
      djService = await Service.findOne({ name: /DJ/i });
    }

    // Mock fallback if DB not populated
    if (!weddingCategory) {
      weddingCategory = {
        _id: new mongoose.Types.ObjectId(),
        name: 'Wedding / Marriage',
        basePricePerAttendee: 1500,
        isActive: true
      };
    }
    if (!cateringService) {
      cateringService = {
        _id: new mongoose.Types.ObjectId(),
        name: 'Catering',
        pricingType: 'perAttendee',
        price: 300,
        isActive: true
      };
    }
    if (!djService) {
      djService = {
        _id: new mongoose.Types.ObjectId(),
        name: 'DJ & Music',
        pricingType: 'flat',
        price: 8000,
        isActive: true
      };
    }

    const attendeeCount = 100;
    const services = [cateringService, djService];

    console.log(`Test Parameters:
- Category: ${weddingCategory.name} (₹${weddingCategory.basePricePerAttendee}/attendee)
- Attendees: ${attendeeCount}
- Service 1: ${cateringService.name} (${cateringService.pricingType} ₹${cateringService.price})
- Service 2: ${djService.name} (${djService.pricingType} ₹${djService.price})`);

    const breakdown = await calculateBookingPrice(weddingCategory, attendeeCount, services);

    console.log('\nCalculated Price Breakdown Result:');
    console.dir(breakdown, { depth: null });

    // Verifications
    const expectedCategoryTotal = 1500 * 100; // 150,000
    const expectedCateringTotal = 300 * 100;  // 30,000
    const expectedDJTotal = 8000;             // 8,000
    const expectedAddOnsTotal = 38000;        // 38,000
    const expectedGrandTotal = 188000;        // 188,000

    let pass = true;

    if (breakdown.categoryTotal !== expectedCategoryTotal) {
      console.error(`FAIL: Category total expected ${expectedCategoryTotal}, got ${breakdown.categoryTotal}`);
      pass = false;
    }
    if (breakdown.addOnsTotal !== expectedAddOnsTotal) {
      console.error(`FAIL: AddOns total expected ${expectedAddOnsTotal}, got ${breakdown.addOnsTotal}`);
      pass = false;
    }
    if (breakdown.grandTotal !== expectedGrandTotal) {
      console.error(`FAIL: Grand total expected ${expectedGrandTotal}, got ${breakdown.grandTotal}`);
      pass = false;
    }

    if (pass) {
      console.log('\n✅ PRICING ENGINE TEST PASSED EXACTLY: Grand Total = ₹188,000!');
    } else {
      console.error('\n❌ PRICING ENGINE TEST FAILED!');
      process.exit(1);
    }

    if (dbConnected) {
      await mongoose.disconnect();
    }
    process.exit(0);
  } catch (error) {
    console.error('Test execution error:', error);
    process.exit(1);
  }
};

runPricingTest();
