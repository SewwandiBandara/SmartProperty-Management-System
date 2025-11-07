const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: [
      'payment_due',
      'payment_received',
      'payment_overdue',
      'lease_expiring',
      'lease_renewal',
      'maintenance_request',
      'maintenance_update',
      'property_approved',
      'property_rejected',
      'message_received',
      'task_assigned',
      'general'
    ],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  relatedProperty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property'
  },
  relatedPayment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment'
  },
  relatedLease: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lease'
  },
  relatedMaintenance: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MaintenanceRequest'
  },
  read: {
    type: Boolean,
    default: false
  },
  readAt: Date,
  actionUrl: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
