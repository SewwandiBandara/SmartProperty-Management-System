const express = require('express');
const Contact = require('../models/Contact');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all contact messages (for all authenticated users)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const contacts = await Contact.find({})
      .populate('user', 'firstName lastName email phone')
      .populate('assignedTo', 'firstName lastName email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      contacts
    });
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching contact messages'
    });
  }
});

// Get single contact message by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id)
      .populate('user', 'firstName lastName email phone')
      .populate('assignedTo', 'firstName lastName email');

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }

    res.json({
      success: true,
      contact
    });
  } catch (error) {
    console.error('Get contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching contact message'
    });
  }
});

// Create new contact message (public endpoint - no auth required for guest users)
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message, userId } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, subject, and message are required'
      });
    }

    const contactData = {
      name,
      email,
      phone,
      subject,
      message
    };

    // If userId is provided (authenticated user), add it
    if (userId) {
      contactData.user = userId;
    }

    const contact = new Contact(contactData);
    await contact.save();

    // Populate before sending response
    await contact.populate('user', 'firstName lastName email phone');

    res.status(201).json({
      success: true,
      message: 'Contact message sent successfully',
      contact
    });
  } catch (error) {
    console.error('Create contact error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error sending contact message'
    });
  }
});

// Update contact message status
router.patch('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { status, notes } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }

    contact.status = status;
    if (notes) contact.notes = notes;

    if (status === 'resolved' && !contact.resolvedDate) {
      contact.resolvedDate = new Date();
    }

    await contact.save();
    await contact.populate('user', 'firstName lastName email phone');
    await contact.populate('assignedTo', 'firstName lastName email');

    res.json({
      success: true,
      message: 'Status updated successfully',
      contact
    });
  } catch (error) {
    console.error('Update contact status error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating status'
    });
  }
});

// Assign contact message to user
router.patch('/:id/assign', authenticateToken, async (req, res) => {
  try {
    const { assignedTo } = req.body;

    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }

    contact.assignedTo = assignedTo;
    if (contact.status === 'new') {
      contact.status = 'in_progress';
    }

    await contact.save();
    await contact.populate('user', 'firstName lastName email phone');
    await contact.populate('assignedTo', 'firstName lastName email');

    res.json({
      success: true,
      message: 'Contact assigned successfully',
      contact
    });
  } catch (error) {
    console.error('Assign contact error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error assigning contact'
    });
  }
});

// Update contact priority
router.patch('/:id/priority', authenticateToken, async (req, res) => {
  try {
    const { priority } = req.body;

    if (!priority) {
      return res.status(400).json({
        success: false,
        message: 'Priority is required'
      });
    }

    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }

    contact.priority = priority;
    await contact.save();
    await contact.populate('user', 'firstName lastName email phone');
    await contact.populate('assignedTo', 'firstName lastName email');

    res.json({
      success: true,
      message: 'Priority updated successfully',
      contact
    });
  } catch (error) {
    console.error('Update priority error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating priority'
    });
  }
});

// Delete contact message
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }

    await Contact.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Contact message deleted successfully'
    });
  } catch (error) {
    console.error('Delete contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting contact message'
    });
  }
});

module.exports = router;
