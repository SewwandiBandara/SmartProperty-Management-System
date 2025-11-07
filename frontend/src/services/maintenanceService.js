import api from './api'

const maintenanceService = {
  // Get all maintenance requests
  getMaintenanceRequests: async () => {
    try {
      const response = await api.get('/maintenance')
      return response.data
    } catch (error) {
      console.error('Get maintenance requests error:', error)
      throw error
    }
  },

  // Get single maintenance request by ID
  getMaintenanceRequestById: async (id) => {
    try {
      const response = await api.get(`/maintenance/${id}`)
      return response.data
    } catch (error) {
      console.error('Get maintenance request error:', error)
      throw error
    }
  },

  // Create new maintenance request
  createMaintenanceRequest: async (requestData) => {
    try {
      const response = await api.post('/maintenance', requestData)
      return response.data
    } catch (error) {
      console.error('Create maintenance request error:', error)
      throw error
    }
  },

  // Update maintenance request
  updateMaintenanceRequest: async (id, requestData) => {
    try {
      const response = await api.put(`/maintenance/${id}`, requestData)
      return response.data
    } catch (error) {
      console.error('Update maintenance request error:', error)
      throw error
    }
  },

  // Delete maintenance request
  deleteMaintenanceRequest: async (id) => {
    try {
      const response = await api.delete(`/maintenance/${id}`)
      return response.data
    } catch (error) {
      console.error('Delete maintenance request error:', error)
      throw error
    }
  },

  // Assign maintenance request to user
  assignMaintenanceRequest: async (id, assignedToId) => {
    try {
      const response = await api.patch(`/maintenance/${id}/assign`, { assignedTo: assignedToId })
      return response.data
    } catch (error) {
      console.error('Assign maintenance request error:', error)
      throw error
    }
  },

  // Update maintenance request status
  updateMaintenanceStatus: async (id, status) => {
    try {
      const response = await api.patch(`/maintenance/${id}/status`, { status })
      return response.data
    } catch (error) {
      console.error('Update maintenance status error:', error)
      throw error
    }
  }
}

export default maintenanceService
