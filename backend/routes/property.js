const express = require('express');
const Property = require('../models/Property');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all properties for the authenticated user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Properties can be viewed by manager only
    const properties = await Property.find({
      manager: userId
    }).populate('manager', 'firstName lastName email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      properties
    });
  } catch (error) {
    console.error('Get properties error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching properties'
    });
  }
});

// Get a single property by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('manager', 'firstName lastName email');

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    res.json({
      success: true,
      property
    });
  } catch (error) {
    console.error('Get property error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching property'
    });
  }
});

// Create a new property
router.post('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const {
      title,
      description,
      address,
      propertyType,
      price,
      bedrooms,
      bathrooms,
      area,
      amenities,
      images
    } = req.body;

    // Get user to check their role
    const User = require('../models/User');
    const user = await User.findById(userId);

    // Only managers can create properties
    if (!user || user.userType !== 'manager') {
      return res.status(403).json({
        success: false,
        message: 'Only managers can create properties'
      });
    }

    const propertyData = {
      title,
      description,
      address,
      propertyType,
      price,
      bedrooms,
      bathrooms,
      area,
      amenities,
      images,
      manager: userId,
      status: 'available'
    };

    const property = new Property(propertyData);

    await property.save();

    res.status(201).json({
      success: true,
      message: 'Property created successfully',
      property
    });
  } catch (error) {
    console.error('Create property error:', error);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error creating property'
    });
  }
});

// Update a property
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Check if user is the manager
    if (property.manager?.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this property'
      });
    }

    const {
      title,
      description,
      address,
      propertyType,
      price,
      bedrooms,
      bathrooms,
      area,
      status,
      amenities,
      images,
      leaseStartDate,
      leaseEndDate
    } = req.body;

    // Update fields
    if (title !== undefined) property.title = title;
    if (description !== undefined) property.description = description;
    if (address !== undefined) property.address = address;
    if (propertyType !== undefined) property.propertyType = propertyType;
    if (price !== undefined) property.price = price;
    if (bedrooms !== undefined) property.bedrooms = bedrooms;
    if (bathrooms !== undefined) property.bathrooms = bathrooms;
    if (area !== undefined) property.area = area;
    if (status !== undefined) property.status = status;
    if (amenities !== undefined) property.amenities = amenities;
    if (images !== undefined) property.images = images;
    if (leaseStartDate !== undefined) property.leaseStartDate = leaseStartDate;
    if (leaseEndDate !== undefined) property.leaseEndDate = leaseEndDate;

    await property.save();

    res.json({
      success: true,
      message: 'Property updated successfully',
      property
    });
  } catch (error) {
    console.error('Update property error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating property'
    });
  }
});

// Delete a property
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Only manager can delete
    if (property.manager?.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this property'
      });
    }

    await Property.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Property deleted successfully'
    });
  } catch (error) {
    console.error('Delete property error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting property'
    });
  }
});

module.exports = router;
