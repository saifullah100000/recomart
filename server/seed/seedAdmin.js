require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const connectDB = require('../config/db');

async function seedAdmin() {
  try {
    await connectDB();
    const existing = await User.findOne({ role: 'admin' });
    if (existing) {
      console.log('Admin already exists:', existing.email);
      process.exit(0);
    }

    const passwordHash = await bcrypt.hash('Admin@123456', 12);
    await User.create({
      fullName: 'RecoMart Admin',
      email: 'admin@recomart.com',
      passwordHash,
      role: 'admin',
      isActive: true,
      isEmailVerified: true
    });

    console.log('Admin created: admin@recomart.com / Admin@123456');
    process.exit(0);
  } catch (error) {
    console.error('Seed admin error:', error.message);
    process.exit(1);
  }
}

seedAdmin();
