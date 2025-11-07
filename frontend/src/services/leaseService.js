import api from './api'

const leaseService = {
  // Get all leases
  getLeases: async (params) => {
    try {
      const response = await api.get('/leases', { params })
      return response.data
    } catch (error) {
      console.error('Get leases error:', error)
      throw error
    }
  },

  // Get single lease by ID
  getLeaseById: async (id) => {
    try {
      const response = await api.get(`/leases/${id}`)
      return response.data
    } catch (error) {
      console.error('Get lease error:', error)
      throw error
    }
  },

  // Create new lease
  createLease: async (leaseData) => {
    try {
      const response = await api.post('/leases', leaseData)
      return response.data
    } catch (error) {
      console.error('Create lease error:', error)
      throw error
    }
  },

  // Update lease
  updateLease: async (id, leaseData) => {
    try {
      const response = await api.put(`/leases/${id}`, leaseData)
      return response.data
    } catch (error) {
      console.error('Update lease error:', error)
      throw error
    }
  },

  // Manager approves lease
  approveLeaseAsManager: async (id) => {
    try {
      const response = await api.patch(`/leases/${id}/approve-manager`)
      return response.data
    } catch (error) {
      console.error('Approve lease (manager) error:', error)
      throw error
    }
  },

  // Customer approves lease
  approveLeaseAsCustomer: async (id) => {
    try {
      const response = await api.patch(`/leases/${id}/approve-customer`)
      return response.data
    } catch (error) {
      console.error('Approve lease (customer) error:', error)
      throw error
    }
  },

  // Terminate lease
  terminateLease: async (id) => {
    try {
      const response = await api.patch(`/leases/${id}/terminate`)
      return response.data
    } catch (error) {
      console.error('Terminate lease error:', error)
      throw error
    }
  },

  // Delete lease
  deleteLease: async (id) => {
    try {
      const response = await api.delete(`/leases/${id}`)
      return response.data
    } catch (error) {
      console.error('Delete lease error:', error)
      throw error
    }
  }
}

export default leaseService
