import api from './api'

const leadService = {
  // Get all leads
  getLeads: async (params) => {
    try {
      const response = await api.get('/leads', { params })
      return response.data
    } catch (error) {
      console.error('Get leads error:', error)
      throw error
    }
  },

  // Get single lead by ID
  getLeadById: async (id) => {
    try {
      const response = await api.get(`/leads/${id}`)
      return response.data
    } catch (error) {
      console.error('Get lead error:', error)
      throw error
    }
  },

  // Create new lead
  createLead: async (leadData) => {
    try {
      const response = await api.post('/leads', leadData)
      return response.data
    } catch (error) {
      console.error('Create lead error:', error)
      throw error
    }
  },

  // Update lead
  updateLead: async (id, leadData) => {
    try {
      const response = await api.put(`/leads/${id}`, leadData)
      return response.data
    } catch (error) {
      console.error('Update lead error:', error)
      throw error
    }
  },

  // Convert lead
  convertLead: async (id, convertedProperty) => {
    try {
      const response = await api.patch(`/leads/${id}/convert`, { convertedProperty })
      return response.data
    } catch (error) {
      console.error('Convert lead error:', error)
      throw error
    }
  },

  // Delete lead
  deleteLead: async (id) => {
    try {
      const response = await api.delete(`/leads/${id}`)
      return response.data
    } catch (error) {
      console.error('Delete lead error:', error)
      throw error
    }
  }
}

export default leadService
