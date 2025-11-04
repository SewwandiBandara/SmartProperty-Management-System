const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

/**
 * Database seed script to create an admin user
 * This should only be run once during initial setup
 *
 * Usage: node seedAdmin.js
 */
const seedAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: process.env.ADMIN_EMAIL });

    if (existingAdmin) {
      console.log('Admin user already exists with email:', process.env.ADMIN_EMAIL);
      process.exit(0);
    }

    // Create admin user using environment variables
    const adminUser = new User({
      firstName: process.env.ADMIN_FIRST_NAME || 'Admin',
      lastName: process.env.ADMIN_LAST_NAME || 'User',
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      userType: 'manager', // Using 'manager' as admin role
      company: process.env.ADMIN_COMPANY || 'Property Management System',
      phone: process.env.ADMIN_PHONE || ''
    });

    await adminUser.save();

    console.log('✓ Admin user created successfully!');
    console.log('Email:', adminUser.email);
    console.log('User Type:', adminUser.userType);
    console.log('\nYou can now login with the admin credentials.');
    console.log('IMPORTANT: Remove admin credentials from .env after first login and password change!');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin user:', error);
    process.exit(1);
  }
};

// Run the seed function
seedAdmin();
