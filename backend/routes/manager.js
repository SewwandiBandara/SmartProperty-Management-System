const express = require('express');
const User = require('../models/User');
const Property = require('../models/Property');
const Payment = require('../models/Payment');
const MaintenanceRequest = require('../models/MaintenanceRequest');
const Task = require('../models/Task');
const Inquiry = require('../models/Inquiry');
const Contact = require('../models/Contact');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Middleware to verify manager access
const verifyManager = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user || user.userType !== 'manager') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Manager only.'
      });
    }
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error verifying manager access'
    });
  }
};

// ==================== PROPERTY MANAGEMENT ====================

// Get all managed properties
router.get('/properties', authenticateToken, verifyManager, async (req, res) => {
  try {
    // Show ALL properties managed by this manager
    const managerId = req.user.userId;
    const properties = await Property.find({
      manager: managerId
    })
      .populate('manager', 'firstName lastName email phone')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      properties
    });
  } catch (error) {
    console.error('Get managed properties error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching managed properties'
    });
  }
});

// Get property details with tenants and maintenance
router.get('/properties/:id', authenticateToken, verifyManager, async (req, res) => {
  try {
    const managerId = req.user.userId;
    const property = await Property.findOne({
      _id: req.params.id,
      manager: managerId
    })
      .populate('manager', 'firstName lastName email phone');

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found or access denied'
      });
    }

    // Get maintenance requests for this property
    const maintenanceRequests = await MaintenanceRequest.find({ property: property._id })
      .populate('customer', 'firstName lastName email phone')
      .sort({ createdAt: -1 });

    // Get payments for this property
    const payments = await Payment.find({ property: property._id })
      .populate('customer', 'firstName lastName')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      property,
      maintenanceRequests,
      payments
    });
  } catch (error) {
    console.error('Get property details error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching property details'
    });
  }
});

// ==================== MAINTENANCE MANAGEMENT ====================

// Get all maintenance requests for managed properties
router.get('/maintenance', authenticateToken, verifyManager, async (req, res) => {
  try {
    const managerId = req.user.userId;
    const { status, priority, propertyId } = req.query;

    // Get all managed property IDs
    const properties = await Property.find({
      manager: managerId
    }).select('_id');
    const propertyIds = properties.map(p => p._id);

    const query = { property: { $in: propertyIds } };

    if (status && status !== 'all') {
      query.status = status;
    }

    if (priority && priority !== 'all') {
      query.priority = priority;
    }

    if (propertyId) {
      query.property = propertyId;
    }

    const maintenanceRequests = await MaintenanceRequest.find(query)
      .populate('property', 'title address')
      .populate('customer', 'firstName lastName email phone')
      .populate('assignedTo', 'firstName lastName email phone')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      maintenanceRequests
    });
  } catch (error) {
    console.error('Get maintenance requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching maintenance requests'
    });
  }
});

// Assign maintenance request
router.patch('/maintenance/:id/assign', authenticateToken, verifyManager, async (req, res) => {
  try {
    const { assignedTo } = req.body;
    const managerId = req.user.userId;

    const maintenance = await MaintenanceRequest.findById(req.params.id).populate('property');

    if (!maintenance) {
      return res.status(404).json({
        success: false,
        message: 'Maintenance request not found'
      });
    }

    // Verify manager has access to this property
    if (maintenance.property.manager?.toString() !== managerId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    maintenance.assignedTo = assignedTo;
    if (maintenance.status === 'pending') {
      maintenance.status = 'in_progress';
    }

    await maintenance.save();

    res.json({
      success: true,
      message: 'Maintenance request assigned successfully',
      maintenance
    });
  } catch (error) {
    console.error('Assign maintenance error:', error);
    res.status(500).json({
      success: false,
      message: 'Error assigning maintenance request'
    });
  }
});

// Update maintenance status
router.patch('/maintenance/:id/status', authenticateToken, verifyManager, async (req, res) => {
  try {
    const { status, notes } = req.body;
    const managerId = req.user.userId;

    const maintenance = await MaintenanceRequest.findById(req.params.id).populate('property');

    if (!maintenance) {
      return res.status(404).json({
        success: false,
        message: 'Maintenance request not found'
      });
    }

    // Verify manager has access
    if (maintenance.property.manager?.toString() !== managerId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    maintenance.status = status;
    if (notes) maintenance.notes = notes;
    if (status === 'completed') {
      maintenance.completedDate = new Date();
    }

    await maintenance.save();

    res.json({
      success: true,
      message: 'Maintenance status updated successfully',
      maintenance
    });
  } catch (error) {
    console.error('Update maintenance status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating maintenance status'
    });
  }
});

// ==================== TASK MANAGEMENT ====================

// Get all tasks
router.get('/tasks', authenticateToken, verifyManager, async (req, res) => {
  try {
    const managerId = req.user.userId;
    const { status, type, priority, propertyId } = req.query;

    // Get managed property IDs
    const properties = await Property.find({
      manager: managerId
    }).select('_id');
    const propertyIds = properties.map(p => p._id);

    const query = {
      $or: [
        { assignedBy: managerId },
        { assignedTo: managerId },
        { property: { $in: propertyIds } }
      ]
    };

    if (status && status !== 'all') {
      query.status = status;
    }

    if (type && type !== 'all') {
      query.type = type;
    }

    if (priority && priority !== 'all') {
      query.priority = priority;
    }

    if (propertyId) {
      query.property = propertyId;
    }

    const tasks = await Task.find(query)
      .populate('property', 'title address')
      .populate('assignedBy', 'firstName lastName')
      .populate('assignedTo', 'firstName lastName')
      .sort({ dueDate: 1, priority: -1 });

    res.json({
      success: true,
      tasks
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching tasks'
    });
  }
});

// Create new task
router.post('/tasks', authenticateToken, verifyManager, async (req, res) => {
  try {
    const managerId = req.user.userId;
    const { title, description, type, priority, property, assignedTo, dueDate, notes } = req.body;

    // Verify property is managed by this manager
    const propertyDoc = await Property.findOne({
      _id: property,
      $or: [
        { manager: managerId },
        { owner: managerId }
      ]
    });

    if (!propertyDoc) {
      return res.status(403).json({
        success: false,
        message: 'Property not found or access denied'
      });
    }

    const task = new Task({
      title,
      description,
      type,
      priority,
      property,
      assignedBy: managerId,
      assignedTo: assignedTo || managerId,
      dueDate,
      notes
    });

    await task.save();

    await task.populate('property', 'title address');
    await task.populate('assignedTo', 'firstName lastName');

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      task
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating task'
    });
  }
});

// Update task
router.put('/tasks/:id', authenticateToken, verifyManager, async (req, res) => {
  try {
    const managerId = req.user.userId;
    const { title, description, type, priority, status, assignedTo, dueDate, notes } = req.body;

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Verify manager has access
    if (task.assignedBy.toString() !== managerId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    if (title) task.title = title;
    if (description) task.description = description;
    if (type) task.type = type;
    if (priority) task.priority = priority;
    if (status) task.status = status;
    if (assignedTo) task.assignedTo = assignedTo;
    if (dueDate) task.dueDate = dueDate;
    if (notes) task.notes = notes;

    if (status === 'completed') {
      task.completedDate = new Date();
    }

    await task.save();

    await task.populate('property', 'title address');
    await task.populate('assignedTo', 'firstName lastName');

    res.json({
      success: true,
      message: 'Task updated successfully',
      task
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating task'
    });
  }
});

// Delete task
router.delete('/tasks/:id', authenticateToken, verifyManager, async (req, res) => {
  try {
    const managerId = req.user.userId;

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Verify manager has access
    if (task.assignedBy.toString() !== managerId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting task'
    });
  }
});

// ==================== TENANT MANAGEMENT ====================

// Get tenants of managed properties
router.get('/tenants', authenticateToken, verifyManager, async (req, res) => {
  try {
    const managerId = req.user.userId;

    const properties = await Property.find({
      $or: [
        { manager: managerId },
        { owner: managerId }
      ],
      currentTenant: { $ne: null }
    })
      .populate('currentTenant', 'firstName lastName email phone')
      .select('title address currentTenant leaseStartDate leaseEndDate');

    const tenants = properties.map(p => ({
      ...p.currentTenant.toObject(),
      property: {
        id: p._id,
        title: p.title,
        address: p.address
      },
      leaseStartDate: p.leaseStartDate,
      leaseEndDate: p.leaseEndDate
    }));

    res.json({
      success: true,
      tenants
    });
  } catch (error) {
    console.error('Get tenants error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching tenants'
    });
  }
});

// Get lease renewals
router.get('/lease-renewals', authenticateToken, verifyManager, async (req, res) => {
  try {
    const managerId = req.user.userId;
    const daysAhead = parseInt(req.query.days) || 60; // Default 60 days ahead

    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysAhead);

    const properties = await Property.find({
      approved: true,
      status: 'occupied',
      leaseEndDate: { $lte: futureDate, $gte: new Date() }
    })
      .populate('currentTenant', 'firstName lastName email phone')
      .populate('owner', 'firstName lastName email phone')
      .populate('manager', 'firstName lastName email phone')
      .sort({ leaseEndDate: 1 });

    res.json({
      success: true,
      renewals: properties
    });
  } catch (error) {
    console.error('Get lease renewals error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching lease renewals'
    });
  }
});

// ==================== REPORTS & ANALYTICS ====================

// Get manager dashboard statistics
router.get('/stats', authenticateToken, verifyManager, async (req, res) => {
  try {
    const managerId = req.user.userId;

    const totalProperties = await Property.countDocuments({
      manager: managerId
    });
    const occupiedProperties = await Property.countDocuments({
      manager: managerId,
      status: 'occupied'
    });

    const properties = await Property.find({
      manager: managerId
    }).select('_id');
    const propertyIds = properties.map(p => p._id);

    const pendingMaintenance = await MaintenanceRequest.countDocuments({
      property: { $in: propertyIds },
      status: { $in: ['pending', 'in_progress'] }
    });

    const pendingTasks = await Task.countDocuments({
      $or: [
        { assignedBy: managerId },
        { assignedTo: managerId }
      ],
      status: { $in: ['pending', 'in_progress'] }
    });

    const overduePayments = await Payment.countDocuments({
      property: { $in: propertyIds },
      status: 'pending',
      dueDate: { $lt: new Date() }
    });

    // Upcoming lease renewals (next 60 days)
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 60);

    const upcomingRenewals = await Property.countDocuments({
      manager: managerId,
      status: 'occupied',
      leaseEndDate: { $lte: futureDate, $gte: new Date() }
    });

    res.json({
      success: true,
      stats: {
        totalProperties,
        occupiedProperties,
        vacantProperties: totalProperties - occupiedProperties,
        occupancyRate: totalProperties > 0 ? ((occupiedProperties / totalProperties) * 100).toFixed(1) : 0,
        pendingMaintenance,
        pendingTasks,
        overduePayments,
        upcomingRenewals
      }
    });
  } catch (error) {
    console.error('Get manager stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics'
    });
  }
});

// Get performance report
router.get('/reports/performance', authenticateToken, verifyManager, async (req, res) => {
  try {
    const managerId = req.user.userId;
    const { startDate, endDate } = req.query;

    const start = startDate ? new Date(startDate) : new Date(new Date().setMonth(new Date().getMonth() - 1));
    const end = endDate ? new Date(endDate) : new Date();

    const properties = await Property.find({
      manager: managerId
    }).select('_id');
    const propertyIds = properties.map(p => p._id);

    // Maintenance statistics
    const maintenanceStats = await MaintenanceRequest.aggregate([
      {
        $match: {
          property: { $in: propertyIds },
          createdAt: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Task statistics
    const taskStats = await Task.aggregate([
      {
        $match: {
          assignedBy: managerId,
          createdAt: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Payment statistics
    const paymentStats = await Payment.aggregate([
      {
        $match: {
          property: { $in: propertyIds },
          createdAt: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          total: { $sum: '$amount' }
        }
      }
    ]);

    res.json({
      success: true,
      report: {
        period: { start, end },
        maintenance: maintenanceStats,
        tasks: taskStats,
        payments: paymentStats
      }
    });
  } catch (error) {
    console.error('Get performance report error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating performance report'
    });
  }
});

// Get occupancy report
router.get('/reports/occupancy', authenticateToken, verifyManager, async (req, res) => {
  try {
    const managerId = req.user.userId;

    const properties = await Property.find({
      $or: [
        { manager: managerId },
        { owner: managerId }
      ]
    })
      .populate('currentTenant', 'firstName lastName email')
      .select('title address status leaseStartDate leaseEndDate');

    const totalProperties = properties.length;
    const occupiedProperties = properties.filter(p => p.status === 'occupied').length;
    const vacantProperties = totalProperties - occupiedProperties;

    const occupancyByType = await Property.aggregate([
      {
        $match: {
          $or: [
            { manager: managerId },
            { owner: managerId }
          ]
        }
      },
      {
        $group: {
          _id: '$propertyType',
          total: { $sum: 1 },
          occupied: {
            $sum: { $cond: [{ $eq: ['$status', 'occupied'] }, 1, 0] }
          }
        }
      }
    ]);

    res.json({
      success: true,
      report: {
        totalProperties,
        occupiedProperties,
        vacantProperties,
        occupancyRate: totalProperties > 0 ? ((occupiedProperties / totalProperties) * 100).toFixed(1) : 0,
        byType: occupancyByType,
        properties
      }
    });
  } catch (error) {
    console.error('Get occupancy report error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating occupancy report'
    });
  }
});

// ==================== USER MANAGEMENT ====================

// Get all users (with filtering) - excluding managers
router.get('/users', authenticateToken, verifyManager, async (req, res) => {
  try {
    const { userType, status, search } = req.query;

    // Base query - exclude managers from the list
    const query = {
      userType: { $ne: 'manager' }
    };

    // If userType filter is applied and it's not 'all', use it (but still exclude managers)
    if (userType && userType !== 'all') {
      if (userType === 'manager') {
        // If someone tries to filter for managers, return empty list
        return res.json({
          success: true,
          users: [],
          stats: {
            total: 0,
            byType: [],
            active: 0,
            inactive: 0
          }
        });
      }
      query.userType = userType;
    }

    if (status) {
      query.isActive = status === 'active';
    }

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 });

    // Get stats excluding managers
    const userStats = {
      total: users.length,
      byType: await User.aggregate([
        {
          $match: { userType: { $ne: 'manager' } }
        },
        {
          $group: {
            _id: '$userType',
            count: { $sum: 1 }
          }
        }
      ]),
      active: users.filter(u => u.isActive !== false).length,
      inactive: users.filter(u => u.isActive === false).length
    };

    res.json({
      success: true,
      users,
      stats: userStats
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users'
    });
  }
});

// Get user by ID
router.get('/users/:id', authenticateToken, verifyManager, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get user's properties if they're a landlord/manager
    let properties = [];
    if (user.userType === 'landlord' || user.userType === 'manager') {
      properties = await Property.find({
        $or: [
          { owner: user._id },
          { manager: user._id }
        ]
      });
    }

    // Get user's leases if they're a tenant
    let leases = [];
    if (user.userType === 'tenant') {
      properties = await Property.find({ currentTenant: user._id })
        .populate('owner', 'firstName lastName email')
        .populate('manager', 'firstName lastName email');
    }

    res.json({
      success: true,
      user,
      properties,
      leases
    });
  } catch (error) {
    console.error('Get user details error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user details'
    });
  }
});

// Update user
router.put('/users/:id', authenticateToken, verifyManager, async (req, res) => {
  try {
    const { firstName, lastName, email, phone, userType, isActive } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent updating manager accounts
    if (user.userType === 'manager') {
      return res.status(403).json({
        success: false,
        message: 'Cannot update manager accounts'
      });
    }

    // Prevent changing user type to manager
    if (userType === 'manager') {
      return res.status(403).json({
        success: false,
        message: 'Cannot change user type to manager'
      });
    }

    // Check if email is already taken by another user
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email already in use'
        });
      }
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (userType) user.userType = userType;
    if (typeof isActive !== 'undefined') user.isActive = isActive;

    await user.save();

    const updatedUser = await User.findById(user._id).select('-password');

    res.json({
      success: true,
      message: 'User updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating user'
    });
  }
});

// Delete user
router.delete('/users/:id', authenticateToken, verifyManager, async (req, res) => {
  try {
    const userId = req.params.id;
    const managerId = req.user.userId;

    // Prevent manager from deleting themselves
    if (userId === managerId) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own account'
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent deleting manager accounts
    if (user.userType === 'manager') {
      return res.status(403).json({
        success: false,
        message: 'Cannot delete manager accounts'
      });
    }

    // Check if user has active properties or leases
    const hasProperties = await Property.countDocuments({
      $or: [
        { owner: userId },
        { manager: userId },
        { currentTenant: userId }
      ]
    });

    if (hasProperties > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete user with active properties or leases. Please reassign or remove them first.'
      });
    }

    await User.findByIdAndDelete(userId);

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting user'
    });
  }
});

// Toggle user active status
router.patch('/users/:id/toggle-status', authenticateToken, verifyManager, async (req, res) => {
  try {
    const userId = req.params.id;
    const managerId = req.user.userId;

    // Prevent manager from deactivating themselves
    if (userId === managerId) {
      return res.status(400).json({
        success: false,
        message: 'You cannot deactivate your own account'
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent toggling status of manager accounts
    if (user.userType === 'manager') {
      return res.status(403).json({
        success: false,
        message: 'Cannot change status of manager accounts'
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    const updatedUser = await User.findById(user._id).select('-password');

    res.json({
      success: true,
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      user: updatedUser
    });
  } catch (error) {
    console.error('Toggle user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user status'
    });
  }
});

// Get user statistics - excluding managers
router.get('/users/stats/overview', authenticateToken, verifyManager, async (req, res) => {
  try {
    // Exclude managers from all statistics
    const totalUsers = await User.countDocuments({ userType: { $ne: 'manager' } });

    const usersByType = await User.aggregate([
      {
        $match: { userType: { $ne: 'manager' } }
      },
      {
        $group: {
          _id: '$userType',
          count: { $sum: 1 }
        }
      }
    ]);

    const activeUsers = await User.countDocuments({
      userType: { $ne: 'manager' },
      isActive: { $ne: false }
    });
    const inactiveUsers = await User.countDocuments({
      userType: { $ne: 'manager' },
      isActive: false
    });

    // Recent registrations (last 30 days) - excluding managers
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentRegistrations = await User.countDocuments({
      userType: { $ne: 'manager' },
      createdAt: { $gte: thirtyDaysAgo }
    });

    res.json({
      success: true,
      stats: {
        totalUsers,
        activeUsers,
        inactiveUsers,
        recentRegistrations,
        byType: usersByType
      }
    });
  } catch (error) {
    console.error('Get user statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user statistics'
    });
  }
});

// ==================== INQUIRIES MANAGEMENT ====================

// Get all inquiries
router.get('/inquiries', authenticateToken, verifyManager, async (req, res) => {
  try {
    const { status, priority } = req.query;

    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (priority && priority !== 'all') {
      query.priority = priority;
    }

    const inquiries = await Inquiry.find(query)
      .populate('property', 'title address')
      .populate('customer', 'firstName lastName email phone')
      .populate('assignedTo', 'firstName lastName')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      inquiries
    });
  } catch (error) {
    console.error('Get inquiries error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching inquiries'
    });
  }
});

// Update inquiry status
router.patch('/inquiries/:id/status', authenticateToken, verifyManager, async (req, res) => {
  try {
    const { status, notes, assignedTo } = req.body;

    const inquiry = await Inquiry.findById(req.params.id);

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found'
      });
    }

    if (status) inquiry.status = status;
    if (notes) inquiry.notes = notes;
    if (assignedTo) inquiry.assignedTo = assignedTo;

    if (status === 'contacted' && !inquiry.contactedDate) {
      inquiry.contactedDate = new Date();
    }

    if (status === 'resolved' || status === 'closed') {
      inquiry.resolvedDate = new Date();
    }

    await inquiry.save();

    await inquiry.populate([
      { path: 'property', select: 'title address' },
      { path: 'customer', select: 'firstName lastName email phone' },
      { path: 'assignedTo', select: 'firstName lastName' }
    ]);

    res.json({
      success: true,
      message: 'Inquiry updated successfully',
      inquiry
    });
  } catch (error) {
    console.error('Update inquiry error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating inquiry'
    });
  }
});

// ==================== CONTACT MESSAGES MANAGEMENT ====================

// Get all contact messages
router.get('/contacts', authenticateToken, verifyManager, async (req, res) => {
  try {
    const { status, priority } = req.query;

    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (priority && priority !== 'all') {
      query.priority = priority;
    }

    const contacts = await Contact.find(query)
      .populate('user', 'firstName lastName email phone')
      .populate('assignedTo', 'firstName lastName')
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

// Update contact message status
router.patch('/contacts/:id/status', authenticateToken, verifyManager, async (req, res) => {
  try {
    const { status, notes, assignedTo, priority } = req.body;

    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }

    if (status) contact.status = status;
    if (notes) contact.notes = notes;
    if (assignedTo) contact.assignedTo = assignedTo;
    if (priority) contact.priority = priority;

    if (status === 'resolved' || status === 'closed') {
      contact.resolvedDate = new Date();
    }

    await contact.save();

    await contact.populate([
      { path: 'user', select: 'firstName lastName email phone' },
      { path: 'assignedTo', select: 'firstName lastName' }
    ]);

    res.json({
      success: true,
      
      message: 'Contact message updated successfully',
      contact
    });
  } catch (error) {
    console.error('Update contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating contact message'
    });
  }
});

// ==================== ALERTS & REMINDERS ====================

// Get all alerts and reminders
router.get('/alerts', authenticateToken, verifyManager, async (req, res) => {
  try {
    const managerId = req.user.userId;

    const properties = await Property.find({
      manager: managerId
    }).select('_id');
    const propertyIds = properties.map(p => p._id);

    // Overdue tasks
    const overdueTasks = await Task.find({
      $or: [
        { assignedBy: managerId },
        { assignedTo: managerId }
      ],
      status: { $in: ['pending', 'in_progress'] },
      dueDate: { $lt: new Date() }
    })
      .populate('property', 'title')
      .sort({ dueDate: 1 })
      .limit(10);

    // Pending maintenance
    const pendingMaintenance = await MaintenanceRequest.find({
      property: { $in: propertyIds },
      status: 'pending'
    })
      .populate('property', 'title')
      .populate('customer', 'firstName lastName')
      .sort({ createdAt: 1 })
      .limit(10);

    // Upcoming lease renewals (next 30 days)
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);

    const upcomingRenewals = await Property.find({
      manager: managerId,
      status: 'occupied',
      leaseEndDate: { $lte: futureDate, $gte: new Date() }
    })
      .sort({ leaseEndDate: 1 });

    // Overdue payments
    const overduePayments = await Payment.find({
      property: { $in: propertyIds },
      status: 'pending',
      dueDate: { $lt: new Date() }
    })
      .populate('customer', 'firstName lastName')
      .populate('property', 'title')
      .sort({ dueDate: 1 })
      .limit(10);

    res.json({
      success: true,
      alerts: {
        overdueTasks,
        pendingMaintenance,
        upcomingRenewals,
        overduePayments
      }
    });
  } catch (error) {
    console.error('Get alerts error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching alerts'
    });
  }
});

module.exports = router;
