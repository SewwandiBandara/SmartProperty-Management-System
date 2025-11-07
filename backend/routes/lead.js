const express = require('express');
const Lead = require('../models/Lead');
const Property = require('../models/Property');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all leads (for managers)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { status, leadType } = req.query;

    // Build query
    const query = { manager: userId };

    if (status && status !== 'all') {
      query.status = status;
    }

    if (leadType && leadType !== 'all') {
      query.leadType = leadType;
    }

    const leads = await Lead.find(query)
      .populate('customer', 'firstName lastName email phone')
      .populate('manager', 'firstName lastName email')
      .populate('interestedProperties', 'title address price')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      leads
    });
  } catch (error) {
    console.error('Get leads error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching leads'
    });
  }
});

// Get single lead by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id)
      .populate('customer', 'firstName lastName email phone')
      .populate('manager', 'firstName lastName email')
      .populate('interestedProperties', 'title address price propertyType');

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    res.json({
      success: true,
      lead
    });
  } catch (error) {
    console.error('Get lead error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching lead'
    });
  }
});

// Create new lead (property inquiry)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const {
      name,
      email,
      phone,
      leadType,
      interestedProperties,
      budget,
      preferredPropertyType,
      preferredLocation,
      bedrooms,
      notes,
      source
    } = req.body;

    // Validate required fields
    if (!name || !email || !leadType) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and lead type are required'
      });
    }

    // Get the property to find its manager
    let managerId = userId;
    if (interestedProperties && interestedProperties.length > 0) {
      const property = await Property.findById(interestedProperties[0]);
      if (property) {
        managerId = property.manager;
      }
    }

    const leadData = {
      name,
      email,
      phone,
      leadType,
      manager: managerId,
      customer: userId,
      interestedProperties: interestedProperties || [],
      budget,
      preferredPropertyType,
      preferredLocation,
      bedrooms,
      notes,
      source: source || 'website',
      lastContactDate: new Date()
    };

    const lead = new Lead(leadData);
    await lead.save();

    await lead.populate('customer', 'firstName lastName email phone');
    await lead.populate('manager', 'firstName lastName email');
    await lead.populate('interestedProperties', 'title address price');

    res.status(201).json({
      success: true,
      message: 'Lead created successfully',
      lead
    });
  } catch (error) {
    console.error('Create lead error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating lead'
    });
  }
});

// Update lead
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const {
      name,
      email,
      phone,
      leadType,
      status,
      interestedProperties,
      budget,
      preferredPropertyType,
      preferredLocation,
      bedrooms,
      notes,
      nextFollowUpDate
    } = req.body;

    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    // Only manager can update
    if (lead.manager.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this lead'
      });
    }

    // Update fields
    if (name) lead.name = name;
    if (email) lead.email = email;
    if (phone) lead.phone = phone;
    if (leadType) lead.leadType = leadType;
    if (status) lead.status = status;
    if (interestedProperties) lead.interestedProperties = interestedProperties;
    if (budget) lead.budget = budget;
    if (preferredPropertyType) lead.preferredPropertyType = preferredPropertyType;
    if (preferredLocation) lead.preferredLocation = preferredLocation;
    if (bedrooms !== undefined) lead.bedrooms = bedrooms;
    if (notes) lead.notes = notes;
    if (nextFollowUpDate) lead.nextFollowUpDate = nextFollowUpDate;

    lead.lastContactDate = new Date();
    await lead.save();

    await lead.populate('customer', 'firstName lastName email phone');
    await lead.populate('manager', 'firstName lastName email');
    await lead.populate('interestedProperties', 'title address price');

    res.json({
      success: true,
      message: 'Lead updated successfully',
      lead
    });
  } catch (error) {
    console.error('Update lead error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating lead'
    });
  }
});

// Convert lead to customer
router.patch('/:id/convert', authenticateToken, async (req, res) => {
  try {
    const { convertedProperty } = req.body;

    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    lead.status = 'converted';
    lead.conversionDate = new Date();
    if (convertedProperty) {
      lead.convertedProperty = convertedProperty;
    }
    if (lead.customer) {
      lead.convertedTo = lead.customer;
    }

    await lead.save();

    res.json({
      success: true,
      message: 'Lead converted successfully',
      lead
    });
  } catch (error) {
    console.error('Convert lead error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error converting lead'
    });
  }
});

// Delete lead
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    // Only manager can delete
    if (lead.manager.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this lead'
      });
    }

    await Lead.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Lead deleted successfully'
    });
  } catch (error) {
    console.error('Delete lead error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting lead'
    });
  }
});

module.exports = router;
