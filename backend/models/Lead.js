const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  // Lead information
  name: {
    type: String,
    required: [true, 'Lead name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },

  // Lead type and status
  leadType: {
    type: String,
    enum: ['buyer', 'renter', 'seller', 'landlord'],
    required: true
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'qualified', 'negotiating', 'converted', 'lost'],
    default: 'new'
  },

  // Agent and property information
  agent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  interestedProperties: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property'
  }],

  // Requirements and preferences
  budget: {
    min: Number,
    max: Number
  },
  preferredPropertyType: {
    type: String,
    enum: ['Apartment', 'House', 'Condo', 'Townhouse', 'Commercial', 'Any']
  },
  preferredLocation: String,
  bedrooms: Number,

  // Interaction tracking
  source: {
    type: String,
    enum: ['website', 'referral', 'advertisement', 'walk-in', 'phone', 'other'],
    default: 'website'
  },
  notes: String,
  lastContactDate: Date,
  nextFollowUpDate: Date,

  // Conversion tracking
  convertedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  convertedProperty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property'
  },
  conversionDate: Date,

  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

leadSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Lead = mongoose.model('Lead', leadSchema);

module.exports = Lead;
