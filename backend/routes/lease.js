const express = require('express');
const Lease = require('../models/Lease');
const Property = require('../models/Property');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all leases
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { status } = req.query;

    // Build query - show leases where user is either manager or customer
    const query = {
      $or: [
        { manager: userId },
        { customer: userId }
      ]
    };

    if (status && status !== 'all') {
      query.status = status;
    }

    const leases = await Lease.find(query)
      .populate('property', 'title address propertyType')
      .populate('manager', 'firstName lastName email phone')
      .populate('customer', 'firstName lastName email phone')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      leases
    });
  } catch (error) {
    console.error('Get leases error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching leases'
    });
  }
});

// Get single lease by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const lease = await Lease.findById(req.params.id)
      .populate('property', 'title address propertyType images')
      .populate('manager', 'firstName lastName email phone')
      .populate('customer', 'firstName lastName email phone');

    if (!lease) {
      return res.status(404).json({
        success: false,
        message: 'Lease not found'
      });
    }

    // Check if user is authorized to view this lease
    if (lease.manager._id.toString() !== userId && lease.customer._id.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this lease'
      });
    }

    res.json({
      success: true,
      lease
    });
  } catch (error) {
    console.error('Get lease error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching lease'
    });
  }
});

// Create new lease (manager only)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const {
      property,
      customer,
      startDate,
      endDate,
      monthlyRent,
      securityDeposit,
      terms
    } = req.body;

    // Validate required fields
    if (!property || !customer || !startDate || !endDate || !monthlyRent) {
      return res.status(400).json({
        success: false,
        message: 'Property, customer, start date, end date, and monthly rent are required'
      });
    }

    // Verify property exists and user is the manager
    const propertyDoc = await Property.findById(property);
    if (!propertyDoc) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    if (propertyDoc.manager.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Only property manager can create leases'
      });
    }

    const leaseData = {
      property,
      manager: userId,
      customer,
      startDate,
      endDate,
      monthlyRent,
      securityDeposit: securityDeposit || 0,
      terms,
      status: 'pending'
    };

    const lease = new Lease(leaseData);
    await lease.save();

    await lease.populate('property', 'title address propertyType');
    await lease.populate('manager', 'firstName lastName email phone');
    await lease.populate('customer', 'firstName lastName email phone');

    res.status(201).json({
      success: true,
      message: 'Lease created successfully',
      lease
    });
  } catch (error) {
    console.error('Create lease error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating lease'
    });
  }
});

// Update lease
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const {
      startDate,
      endDate,
      monthlyRent,
      securityDeposit,
      status,
      terms
    } = req.body;

    const lease = await Lease.findById(req.params.id);

    if (!lease) {
      return res.status(404).json({
        success: false,
        message: 'Lease not found'
      });
    }

    // Only manager can update lease
    if (lease.manager.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Only manager can update lease'
      });
    }

    // Update fields
    if (startDate) lease.startDate = startDate;
    if (endDate) lease.endDate = endDate;
    if (monthlyRent !== undefined) lease.monthlyRent = monthlyRent;
    if (securityDeposit !== undefined) lease.securityDeposit = securityDeposit;
    if (status) lease.status = status;
    if (terms) lease.terms = terms;

    await lease.save();

    await lease.populate('property', 'title address propertyType');
    await lease.populate('manager', 'firstName lastName email phone');
    await lease.populate('customer', 'firstName lastName email phone');

    res.json({
      success: true,
      message: 'Lease updated successfully',
      lease
    });
  } catch (error) {
    console.error('Update lease error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating lease'
    });
  }
});

// Manager approves lease
router.patch('/:id/approve-manager', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const lease = await Lease.findById(req.params.id);

    if (!lease) {
      return res.status(404).json({
        success: false,
        message: 'Lease not found'
      });
    }

    if (lease.manager.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Only manager can approve this lease'
      });
    }

    lease.approvedByManager = true;

    // If both parties approved, activate lease
    if (lease.approvedByCustomer && lease.approvedByManager) {
      lease.status = 'active';
      lease.signedAt = new Date();
    }

    await lease.save();

    res.json({
      success: true,
      message: 'Lease approved by manager',
      lease
    });
  } catch (error) {
    console.error('Approve lease error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error approving lease'
    });
  }
});

// Customer approves lease
router.patch('/:id/approve-customer', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const lease = await Lease.findById(req.params.id);

    if (!lease) {
      return res.status(404).json({
        success: false,
        message: 'Lease not found'
      });
    }

    if (lease.customer.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Only customer can approve this lease'
      });
    }

    lease.approvedByCustomer = true;

    // If both parties approved, activate lease
    if (lease.approvedByCustomer && lease.approvedByManager) {
      lease.status = 'active';
      lease.signedAt = new Date();
    }

    await lease.save();

    res.json({
      success: true,
      message: 'Lease approved by customer',
      lease
    });
  } catch (error) {
    console.error('Approve lease error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error approving lease'
    });
  }
});

// Terminate lease
router.patch('/:id/terminate', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const lease = await Lease.findById(req.params.id);

    if (!lease) {
      return res.status(404).json({
        success: false,
        message: 'Lease not found'
      });
    }

    // Only manager can terminate
    if (lease.manager.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Only manager can terminate lease'
      });
    }

    lease.status = 'terminated';
    await lease.save();

    res.json({
      success: true,
      message: 'Lease terminated successfully',
      lease
    });
  } catch (error) {
    console.error('Terminate lease error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error terminating lease'
    });
  }
});

// Delete lease
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const lease = await Lease.findById(req.params.id);

    if (!lease) {
      return res.status(404).json({
        success: false,
        message: 'Lease not found'
      });
    }

    // Only manager can delete
    if (lease.manager.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Only manager can delete lease'
      });
    }

    await Lease.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Lease deleted successfully'
    });
  } catch (error) {
    console.error('Delete lease error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting lease'
    });
  }
});

module.exports = router;
