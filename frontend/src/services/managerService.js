import api from './api'

const managerService = {
  // ==================== PROPERTY MANAGEMENT ====================

  // Get managed properties
  getManagedProperties: async () => {
    try {
      const response = await api.get('/manager/properties')
      return response.data
    } catch (error) {
      console.error('Get managed properties error:', error)
      throw error
    }
  },

  // Get property details
  getPropertyDetails: async (propertyId) => {
    try {
      const response = await api.get(`/manager/properties/${propertyId}`)
      return response.data
    } catch (error) {
      console.error('Get property details error:', error)
      throw error
    }
  },

  // Add property
  addProperty: async (propertyData) => {
    try {
      const response = await api.post('/properties', propertyData)
      return response.data
    } catch (error) {
      console.error('Add property error:', error)
      throw error
    }
  },

  // Update property
  updateProperty: async (propertyId, propertyData) => {
    try {
      const response = await api.put(`/properties/${propertyId}`, propertyData)
      return response.data
    } catch (error) {
      console.error('Update property error:', error)
      throw error
    }
  },

  // Delete property
  deleteProperty: async (propertyId) => {
    try {
      const response = await api.delete(`/properties/${propertyId}`)
      return response.data
    } catch (error) {
      console.error('Delete property error:', error)
      throw error
    }
  },

  // ==================== MAINTENANCE MANAGEMENT ====================

  // Get maintenance requests
  getMaintenanceRequests: async (params) => {
    try {
      const response = await api.get('/manager/maintenance', { params })
      return response.data
    } catch (error) {
      console.error('Get maintenance requests error:', error)
      throw error
    }
  },

  // Assign maintenance request
  assignMaintenance: async (maintenanceId, assignedTo) => {
    try {
      const response = await api.patch(`/manager/maintenance/${maintenanceId}/assign`, { assignedTo })
      return response.data
    } catch (error) {
      console.error('Assign maintenance error:', error)
      throw error
    }
  },

  // Update maintenance status
  updateMaintenanceStatus: async (maintenanceId, status, notes) => {
    try {
      const response = await api.patch(`/manager/maintenance/${maintenanceId}/status`, { status, notes })
      return response.data
    } catch (error) {
      console.error('Update maintenance status error:', error)
      throw error
    }
  },

  // Create maintenance request
  createMaintenanceRequest: async (maintenanceData) => {
    try {
      const response = await api.post('/maintenance', maintenanceData)
      return response.data
    } catch (error) {
      console.error('Create maintenance request error:', error)
      throw error
    }
  },

  // Update maintenance request
  updateMaintenanceRequest: async (maintenanceId, maintenanceData) => {
    try {
      const response = await api.put(`/maintenance/${maintenanceId}`, maintenanceData)
      return response.data
    } catch (error) {
      console.error('Update maintenance request error:', error)
      throw error
    }
  },

  // Delete maintenance request
  deleteMaintenanceRequest: async (maintenanceId) => {
    try {
      const response = await api.delete(`/maintenance/${maintenanceId}`)
      return response.data
    } catch (error) {
      console.error('Delete maintenance request error:', error)
      throw error
    }
  },

  // ==================== TASK MANAGEMENT ====================

  // Get tasks
  getTasks: async (params) => {
    try {
      const response = await api.get('/manager/tasks', { params })
      return response.data
    } catch (error) {
      console.error('Get tasks error:', error)
      throw error
    }
  },

  // Create task
  createTask: async (taskData) => {
    try {
      const response = await api.post('/manager/tasks', taskData)
      return response.data
    } catch (error) {
      console.error('Create task error:', error)
      throw error
    }
  },

  // Update task
  updateTask: async (taskId, taskData) => {
    try {
      const response = await api.put(`/manager/tasks/${taskId}`, taskData)
      return response.data
    } catch (error) {
      console.error('Update task error:', error)
      throw error
    }
  },

  // Delete task
  deleteTask: async (taskId) => {
    try {
      const response = await api.delete(`/manager/tasks/${taskId}`)
      return response.data
    } catch (error) {
      console.error('Delete task error:', error)
      throw error
    }
  },

  // ==================== TENANT MANAGEMENT ====================

  // Get tenants
  getTenants: async () => {
    try {
      const response = await api.get('/manager/tenants')
      return response.data
    } catch (error) {
      console.error('Get tenants error:', error)
      throw error
    }
  },

  // Get lease renewals
  getLeaseRenewals: async (days = 60) => {
    try {
      const response = await api.get('/manager/lease-renewals', { params: { days } })
      return response.data
    } catch (error) {
      console.error('Get lease renewals error:', error)
      throw error
    }
  },

  // ==================== REPORTS & ANALYTICS ====================

  // Get statistics
  getStats: async () => {
    try {
      const response = await api.get('/manager/stats')
      return response.data
    } catch (error) {
      console.error('Get stats error:', error)
      throw error
    }
  },

  // Get performance report
  getPerformanceReport: async (startDate, endDate) => {
    try {
      const response = await api.get('/manager/reports/performance', {
        params: { startDate, endDate }
      })
      return response.data
    } catch (error) {
      console.error('Get performance report error:', error)
      throw error
    }
  },

  // Get occupancy report
  getOccupancyReport: async () => {
    try {
      const response = await api.get('/manager/reports/occupancy')
      return response.data
    } catch (error) {
      console.error('Get occupancy report error:', error)
      throw error
    }
  },

  // ==================== ALERTS & REMINDERS ====================

  // Get alerts
  getAlerts: async () => {
    try {
      const response = await api.get('/manager/alerts')
      return response.data
    } catch (error) {
      console.error('Get alerts error:', error)
      throw error
    }
  },

  // ==================== USER MANAGEMENT ====================

  // Get all users with optional filtering
  getUsers: async (params) => {
    try {
      const response = await api.get('/manager/users', { params })
      return response.data
    } catch (error) {
      console.error('Get users error:', error)
      throw error
    }
  },

  // Get user by ID
  getUserById: async (userId) => {
    try {
      const response = await api.get(`/manager/users/${userId}`)
      return response.data
    } catch (error) {
      console.error('Get user details error:', error)
      throw error
    }
  },

  // Update user
  updateUser: async (userId, userData) => {
    try {
      const response = await api.put(`/manager/users/${userId}`, userData)
      return response.data
    } catch (error) {
      console.error('Update user error:', error)
      throw error
    }
  },

  // Delete user
  deleteUser: async (userId) => {
    try {
      const response = await api.delete(`/manager/users/${userId}`)
      return response.data
    } catch (error) {
      console.error('Delete user error:', error)
      throw error
    }
  },

  // Toggle user active status
  toggleUserStatus: async (userId) => {
    try {
      const response = await api.patch(`/manager/users/${userId}/toggle-status`)
      return response.data
    } catch (error) {
      console.error('Toggle user status error:', error)
      throw error
    }
  },

  // Get user statistics
  getUserStats: async () => {
    try {
      const response = await api.get('/manager/users/stats/overview')
      return response.data
    } catch (error) {
      console.error('Get user statistics error:', error)
      throw error
    }
  },

  // ==================== INQUIRIES MANAGEMENT ====================

  // Get all inquiries
  getInquiries: async (params) => {
    try {
      const response = await api.get('/manager/inquiries', { params })
      return response.data
    } catch (error) {
      console.error('Get inquiries error:', error)
      throw error
    }
  },

  // Update inquiry status
  updateInquiryStatus: async (inquiryId, data) => {
    try {
      const response = await api.patch(`/manager/inquiries/${inquiryId}/status`, data)
      return response.data
    } catch (error) {
      console.error('Update inquiry status error:', error)
      throw error
    }
  },

  // ==================== CONTACT MESSAGES MANAGEMENT ====================

  // Get all contact messages
  getContacts: async (params) => {
    try {
      const response = await api.get('/manager/contacts', { params })
      return response.data
    } catch (error) {
      console.error('Get contacts error:', error)
      throw error
    }
  },

  // Update contact status
  updateContactStatus: async (contactId, data) => {
    try {
      const response = await api.patch(`/manager/contacts/${contactId}/status`, data)
      return response.data
    } catch (error) {
      console.error('Update contact status error:', error)
      throw error
    }
  }
}

export default managerService
