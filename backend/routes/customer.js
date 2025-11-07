const express = require('express');
const User = require('../models/User');
const Property = require('../models/Property');
const Inquiry = require('../models/Inquiry');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get user's favorite properties
router.get('/favorites', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .populate({
        path: 'favoriteProperties',
        populate: [
          { path: 'owner', select: 'firstName lastName email phone' },
          { path: 'agent', select: 'firstName lastName email phone company' }
        ]
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      favorites: user.favoriteProperties || []
    });
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching favorite properties'
    });
  }
});

// Add property to favorites
router.post('/favorites/:propertyId', authenticateToken, async (req, res) => {
  try {
    const { propertyId } = req.params;

    // Check if property exists
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if already in favorites
    if (user.favoriteProperties.includes(propertyId)) {
      return res.status(400).json({
        success: false,
        message: 'Property already in favorites'
      });
    }

    user.favoriteProperties.push(propertyId);
    await user.save();

    res.json({
      success: true,
      message: 'Property added to favorites',
      favorites: user.favoriteProperties
    });
  } catch (error) {
    console.error('Add to favorites error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding property to favorites'
    });
  }
});

// Remove property from favorites
router.delete('/favorites/:propertyId', authenticateToken, async (req, res) => {
  try {
    const { propertyId } = req.params;

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.favoriteProperties = user.favoriteProperties.filter(
      id => id.toString() !== propertyId
    );
    await user.save();

    res.json({
      success: true,
      message: 'Property removed from favorites',
      favorites: user.favoriteProperties
    });
  } catch (error) {
    console.error('Remove from favorites error:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing property from favorites'
    });
  }
});

// Contact agent/owner about a property
router.post('/contact-inquiry', authenticateToken, async (req, res) => {
  try {
    const { propertyId, message, preferredContactTime } = req.body;

    if (!propertyId || !message) {
      return res.status(400).json({
        success: false,
        message: 'Property ID and message are required'
      });
    }

    const property = await Property.findById(propertyId)
      .populate('owner', 'firstName lastName email phone')
      .populate('agent', 'firstName lastName email phone company')
      .populate('manager', 'firstName lastName email phone');

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    const user = await User.findById(req.user.userId);

    // Create inquiry in database
    const inquiry = new Inquiry({
      property: propertyId,
      customer: req.user.userId,
      message,
      preferredContactTime: preferredContactTime || '',
      status: 'new',
      priority: 'medium'
    });

    await inquiry.save();

    // Populate the inquiry
    await inquiry.populate([
      { path: 'property', select: 'title address' },
      { path: 'customer', select: 'firstName lastName email phone' }
    ]);

    const contactPerson = property.agent || property.manager || property.owner;

    res.json({
      success: true,
      message: 'Inquiry sent successfully! We will contact you soon.',
      inquiry,
      contactInfo: {
        name: `${contactPerson.firstName} ${contactPerson.lastName}`,
        email: contactPerson.email,
        phone: contactPerson.phone,
        company: contactPerson.company
      }
    });
  } catch (error) {
    console.error('Contact inquiry error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending inquiry'
    });
  }
});

// Get available properties with advanced filters
router.get('/browse-properties', authenticateToken, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      propertyType,
      minPrice,
      maxPrice,
      bedrooms,
      bathrooms,
      minArea,
      maxArea,
      location,
      amenities,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const query = { status: 'available', approved: true };

    // Apply filters
    if (propertyType && propertyType !== 'all') {
      query.propertyType = propertyType;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (bedrooms) {
      query.bedrooms = Number(bedrooms);
    }

    if (bathrooms) {
      query.bathrooms = Number(bathrooms);
    }

    if (minArea || maxArea) {
      query.area = {};
      if (minArea) query.area.$gte = Number(minArea);
      if (maxArea) query.area.$lte = Number(maxArea);
    }

    if (location) {
      query.address = { $regex: location, $options: 'i' };
    }

    if (amenities) {
      const amenitiesArray = amenities.split(',');
      query.amenities = { $all: amenitiesArray };
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const totalProperties = await Property.countDocuments(query);
    const properties = await Property.find(query)
      .populate('owner', 'firstName lastName email phone')
      .populate('agent', 'firstName lastName email phone company')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Get user's favorites
    const user = await User.findById(req.user.userId).select('favoriteProperties');
    const favoriteIds = user?.favoriteProperties?.map(id => id.toString()) || [];

    // Add isFavorite flag to each property
    const propertiesWithFavorite = properties.map(property => ({
      ...property.toObject(),
      isFavorite: favoriteIds.includes(property._id.toString())
    }));

    res.json({
      success: true,
      properties: propertiesWithFavorite,
      totalPages: Math.ceil(totalProperties / limit),
      currentPage: Number(page),
      totalProperties
    });
  } catch (error) {
    console.error('Browse properties error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching properties'
    });
  }
});

// Get property details with enhanced information
router.get('/property/:id', authenticateToken, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('owner', 'firstName lastName email phone company')
      .populate('agent', 'firstName lastName email phone company')
      .populate('manager', 'firstName lastName email phone');

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Check if user has favorited this property
    const user = await User.findById(req.user.userId).select('favoriteProperties');
    const isFavorite = user?.favoriteProperties?.some(
      id => id.toString() === property._id.toString()
    );

    // Get similar properties (same type, similar price range)
    const similarProperties = await Property.find({
      _id: { $ne: property._id },
      propertyType: property.propertyType,
      price: {
        $gte: property.price * 0.8,
        $lte: property.price * 1.2
      },
      status: 'available',
      approved: true
    })
      .limit(4)
      .select('title address price bedrooms bathrooms images');

    res.json({
      success: true,
      property: {
        ...property.toObject(),
        isFavorite
      },
      similarProperties
    });
  } catch (error) {
    console.error('Get property details error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching property details'
    });
  }
});

module.exports = router;
