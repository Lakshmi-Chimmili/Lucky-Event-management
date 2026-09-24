const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');
const Category = require('../models/Category');
const Service = require('../models/Service');
const StaffProfile = require('../models/StaffProfile');
const Booking = require('../models/Booking');
const ContactMessage = require('../models/ContactMessage');
const Notification = require('../models/Notification');

const categoriesData = [
  {
    name: 'Birthday Party',
    description: 'Celebrate your special milestone with themed decors, fun activities, cake cutting management & music.',
    basePricePerAttendee: 500,
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80&w=800'
  },
  {
    name: 'Wedding / Marriage',
    description: 'Grand wedding coordination from mandap setup, guest hospitality, royal catering to luxury videography.',
    basePricePerAttendee: 1500,
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800'
  },
  {
    name: 'Corporate / Professional Event',
    description: 'Seamless corporate conferences, product launches, gala dinners & team building summits with AV support.',
    basePricePerAttendee: 1000,
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800'
  },
  {
    name: 'Family Function',
    description: 'Warm get-togethers, housewarming, poojas & family reunions managed with care and personalized hospitality.',
    basePricePerAttendee: 700,
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800'
  },
  {
    name: 'Engagement Ceremony',
    description: 'Ring exchange ceremony management with aesthetic ring trays, floral stages, and intimate dinner setups.',
    basePricePerAttendee: 900,
    image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&q=80&w=800'
  },
  {
    name: 'Anniversary',
    description: 'Commemorate years of love with romantic candle-light themes, live violinists, and custom photobooths.',
    basePricePerAttendee: 800,
    image: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80&w=800'
  },
  {
    name: 'Baby Shower',
    description: 'Charming pastel-themed baby shower decor, fun baby trivia games, return gifts & refreshment counters.',
    basePricePerAttendee: 750,
    image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=800'
  },
  {
    name: 'Reception',
    description: 'High-end post-wedding receptions featuring red carpet entrances, banquet halls, multi-cuisine dining & DJ.',
    basePricePerAttendee: 1200,
    image: 'https://images.unsplash.com/photo-1544077960-604201fe74bc?auto=format&fit=crop&q=80&w=800'
  },
  {
    name: 'College / School Event',
    description: 'Vibrant cultural fests, farewell parties & annual functions with heavy sound, stage trusses and light shows.',
    basePricePerAttendee: 600,
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800'
  },
  {
    name: 'Other Event',
    description: 'Custom tailor-made event management services for any unique gathering or private party.',
    basePricePerAttendee: 500,
    image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=800'
  }
];

const servicesData = [
  {
    name: 'Dance Performance',
    description: 'Professional choreographers and dance troupes for sangeet or entertainment performance.',
    pricingType: 'flat',
    price: 5000,
    image: 'https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&q=80&w=800'
  },
  {
    name: 'Games & Entertainment',
    description: 'Engaging party host, fun interactive group games, props, and spot prizes for guests.',
    pricingType: 'flat',
    price: 3000,
    image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80&w=800'
  },
  {
    name: 'Natural / Floral Decoration',
    description: 'Fresh aromatic roses, orchids, carnations & marigold floral arrangements.',
    pricingType: 'perAttendee',
    price: 150,
    image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&q=80&w=800'
  },
  {
    name: 'DJ & Music',
    description: 'Professional club DJ with high-octane sound tracks, console & smoke machine effects.',
    pricingType: 'flat',
    price: 8000,
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=800'
  },
  {
    name: 'Photography & Videography',
    description: 'Candid photography, 4K cinematic highlight video, drone shots & online album.',
    pricingType: 'flat',
    price: 10000,
    image: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&q=80&w=800'
  },
  {
    name: 'Catering',
    description: 'Multi-course gourmet buffet (starters, main course, live counters & dessert assortments).',
    pricingType: 'perAttendee',
    price: 300,
    image: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=800'
  },
  {
    name: 'Stage Decoration',
    description: 'Custom royal backdrop, LED screens, velvet couches & floral framing.',
    pricingType: 'flat',
    price: 12000,
    image: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80&w=800'
  },
  {
    name: 'Sound System',
    description: 'High wattage JBL/RCF line array speakers, wireless mic & audio mixer setup.',
    pricingType: 'flat',
    price: 7000,
    image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80&w=800'
  },
  {
    name: 'Lighting',
    description: 'Sharpy lights, ambient mood uplighting, lasers and moving heads stage light show.',
    pricingType: 'flat',
    price: 6000,
    image: 'https://images.unsplash.com/photo-1508997449629-303059a039c0?auto=format&fit=crop&q=80&w=800'
  },
  {
    name: 'Event Host / Anchor',
    description: 'Fluent, energetic bilingual master of ceremonies (emcee) to conduct event timeline.',
    pricingType: 'flat',
    price: 5000,
    image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=800'
  },
  {
    name: 'Invitation Design',
    description: 'Digital video invite, customized animated e-cards & printed luxury hardcover invites.',
    pricingType: 'flat',
    price: 2500,
    image: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=800'
  },
  {
    name: 'Return Gifts',
    description: 'Elegantly packaged personalized favor boxes for every attending guest.',
    pricingType: 'perAttendee',
    price: 100,
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=800'
  }
];

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/eventease';
    await mongoose.connect(mongoUri);
    console.log('[Seed] Connected to MongoDB at:', mongoUri);

    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Service.deleteMany({});
    await StaffProfile.deleteMany({});
    await Booking.deleteMany({});
    await ContactMessage.deleteMany({});
    await Notification.deleteMany({});

    console.log('[Seed] Cleared database collections.');

    // Seed Admin
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@eventease.com',
      passwordHash: 'Admin@12345',
      phone: '+91 9876543210',
      role: 'admin'
    });

    // Seed Staff
    const staffUser = await User.create({
      name: 'Rohan Sharma (Lead Manager)',
      email: 'staff@eventease.com',
      passwordHash: 'Staff@12345',
      phone: '+91 9811223344',
      role: 'staff'
    });

    await StaffProfile.create({
      user: staffUser._id,
      phone: '+91 9811223344',
      specialization: 'Senior Wedding & Gala Manager',
      experience: '5+ Years',
      skills: ['Wedding Planning', 'Vendor Management', 'Crisis Resolution', 'Guest Hospitality'],
      availability: true
    });

    // Seed Customer
    const customerUser = await User.create({
      name: 'Rahul Verma',
      email: 'customer@eventease.com',
      passwordHash: 'Customer@12345',
      phone: '+91 9988776655',
      role: 'customer'
    });

    console.log('[Seed] Created default users (Admin, Staff, Customer).');

    // Seed Categories
    const categories = await Category.insertMany(categoriesData);
    console.log(`[Seed] Created ${categories.length} Event Categories.`);

    // Seed Services
    const services = await Service.insertMany(servicesData);
    console.log(`[Seed] Created ${services.length} Event Services.`);

    console.log('====================================================');
    console.log('SEEDING COMPLETED SUCCESSFULLY!');
    console.log('Test Credentials:');
    console.log('  Admin:    admin@eventease.com / Admin@12345');
    console.log('  Staff:    staff@eventease.com / Staff@12345');
    console.log('  Customer: customer@eventease.com / Customer@12345');
    console.log('====================================================');

    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]', error);
    process.exit(1);
  }
};

seedDB();
