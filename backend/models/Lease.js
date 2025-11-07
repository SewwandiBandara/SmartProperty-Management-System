const mongoose = require('mongoose');

const leaseSchema = new mongoose.Schema({
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  landlord: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tenant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  startDate: {
    type: Date,
    required: [true, 'Lease start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'Lease end date is required']
  },
  monthlyRent: {
    type: Number,
    required: [true, 'Monthly rent is required']
  },
  securityDeposit: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'expired', 'terminated', 'renewed'],
    default: 'pending'
  },
  terms: {
    type: String
  },
  documents: [{
    name: String,
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  approvedByLandlord: {
    type: Boolean,
    default: false
  },
  approvedByTenant: {
    type: Boolean,
    default: false
  },
  signedAt: Date,
  renewalNotificationSent: {
    type: Boolean,
    default: false
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

leaseSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Lease = mongoose.model('Lease', leaseSchema);

module.exports = Lease;
