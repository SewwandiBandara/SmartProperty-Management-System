const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Property title is required'],
    trim: true
  },
  description: {
    type: String
  },
  address: {
    type: String,
    required: [true, 'Property address is required']
  },
  propertyType: {
    type: String,
    enum: ['Apartment', 'House', 'Condo', 'Townhouse', 'Commercial'],
    required: true
  },
  price: {
    type: Number,
    required: [true, 'Property price is required']
  },
  bedrooms: Number,
  bathrooms: Number,
  area: Number, // in square feet
  status: {
    type: String,
    enum: ['available', 'occupied', 'maintenance'],
    default: 'available'
  },
  amenities: [String],
  images: [String],
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  leaseStartDate: Date,
  leaseEndDate: Date,
  approved: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

propertySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Property = mongoose.model('Property', propertySchema);

module.exports = Property;
