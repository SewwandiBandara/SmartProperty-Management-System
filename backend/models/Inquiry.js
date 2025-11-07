const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: [true, 'Inquiry message is required'],
    trim: true
  },
  preferredContactTime: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'in_progress', 'resolved', 'closed'],
    default: 'new'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  notes: {
    type: String
  },
  contactedDate: {
    type: Date
  },
  resolvedDate: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for faster queries
inquirySchema.index({ status: 1, createdAt: -1 });
inquirySchema.index({ customer: 1 });
inquirySchema.index({ property: 1 });
inquirySchema.index({ assignedTo: 1 });

const Inquiry = mongoose.model('Inquiry', inquirySchema);

module.exports = Inquiry;
