const express = require('express');
const MaintenanceRequest = require('../models/MaintenanceRequest');
const Property = require('../models/Property');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all maintenance requests for authenticated user
router.get('/', authenticateToken, async (req, res) => {
  try {
    // Show ALL maintenance requests to all authenticated users
    const requests = await MaintenanceRequest.find({})
      .populate('property', 'title address')
      .populate('customer', 'firstName lastName email')
      .populate('assignedTo', 'firstName lastName email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      requests
    });
  } catch (error) {
    console.error('Get maintenance requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching maintenance requests'
    });
  }
});

// Get single maintenance request by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const requestId = req.params.id;

    const request = await MaintenanceRequest.findById(requestId)
      .populate('property', 'title address manager')
      .populate('customer', 'firstName lastName email')
      .populate('assignedTo', 'firstName lastName email');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Maintenance request not found'
      });
    }

    // Allow all authenticated users to view maintenance requests
    res.json({
      success: true,
      request
    });
  } catch (error) {
    console.error('Get maintenance request error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching maintenance request'
    });
  }
});

// Create new maintenance request
router.post('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { property, title, description, category, priority, images } = req.body;

    // Validate required fields
    if (!property || !title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Property, title, and description are required'
      });
    }

    // Verify property exists - allow all users to create maintenance requests
    const propertyDoc = await Property.findById(property);
    if (!propertyDoc) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    const maintenanceRequest = new MaintenanceRequest({
      property,
      customer: userId,
      title,
      description,
      category: category || 'other',
      priority: priority || 'medium',
      images: images || []
    });

    await maintenanceRequest.save();

    // Populate before sending response
    await maintenanceRequest.populate('property', 'title address');
    await maintenanceRequest.populate('customer', 'firstName lastName email');

    res.status(201).json({
      success: true,
      message: 'Maintenance request created successfully',
      request: maintenanceRequest
    });
  } catch (error) {
    console.error('Create maintenance request error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating maintenance request'
    });
  }
});

// Update maintenance request
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const requestId = req.params.id;
    const { title, description, category, priority, status, cost, notes } = req.body;

    const request = await MaintenanceRequest.findById(requestId).populate('property');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Maintenance request not found'
      });
    }

    // Allow all authenticated users to update maintenance requests

    // Update allowed fields
    if (title) request.title = title;
    if (description) request.description = description;
    if (category) request.category = category;
    if (priority) request.priority = priority;
    if (status) request.status = status;
    if (cost !== undefined) request.cost = cost;
    if (notes) request.notes = notes;

    if (status === 'completed' && !request.completedDate) {
      request.completedDate = new Date();
    }

    await request.save();

    // Populate before sending response
    await request.populate('property', 'title address');
    await request.populate('customer', 'firstName lastName email');
    await request.populate('assignedTo', 'firstName lastName email');

    res.json({
      success: true,
      message: 'Maintenance request updated successfully',
      request
    });
  } catch (error) {
    console.error('Update maintenance request error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating maintenance request'
    });
  }
});

// Update maintenance request status
router.patch('/:id/status', authenticateToken, async (req, res) => {
  try {
    const requestId = req.params.id;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

    const request = await MaintenanceRequest.findById(requestId).populate('property');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Maintenance request not found'
      });
    }

    // Allow all authenticated users to update status

    request.status = status;
    if (status === 'completed' && !request.completedDate) {
      request.completedDate = new Date();
    }

    await request.save();

    res.json({
      success: true,
      message: 'Status updated successfully',
      request
    });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating status'
    });
  }
});

// Assign maintenance request to user
router.patch('/:id/assign', authenticateToken, async (req, res) => {
  try {
    const requestId = req.params.id;
    const { assignedTo } = req.body;

    const request = await MaintenanceRequest.findById(requestId).populate('property');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Maintenance request not found'
      });
    }

    // Allow all authenticated users to assign maintenance requests

    request.assignedTo = assignedTo;
    if (request.status === 'pending') {
      request.status = 'in_progress';
    }

    await request.save();
    await request.populate('assignedTo', 'firstName lastName email');

    res.json({
      success: true,
      message: 'Request assigned successfully',
      request
    });
  } catch (error) {
    console.error('Assign request error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error assigning request'
    });
  }
});

// Delete maintenance request
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const requestId = req.params.id;

    const request = await MaintenanceRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Maintenance request not found'
      });
    }

    // Allow all authenticated users to delete maintenance requests

    await MaintenanceRequest.findByIdAndDelete(requestId);

    res.json({
      success: true,
      message: 'Maintenance request deleted successfully'
    });
  } catch (error) {
    console.error('Delete maintenance request error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting maintenance request'
    });
  }
});

module.exports = router;
