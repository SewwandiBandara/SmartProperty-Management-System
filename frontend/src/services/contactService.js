import api from './api'

const contactService = {
  // Get all contact messages
  getAllContacts: async () => {
    try {
      const response = await api.get('/contact')
      return response.data
    } catch (error) {
      console.error('Get contacts error:', error)
      throw error
    }
  },

  // Get single contact message by ID
  getContactById: async (id) => {
    try {
      const response = await api.get(`/contact/${id}`)
      return response.data
    } catch (error) {
      console.error('Get contact error:', error)
      throw error
    }
  },

  // Create new contact message
  createContact: async (contactData) => {
    try {
      const response = await api.post('/contact', contactData)
      return response.data
    } catch (error) {
      console.error('Create contact error:', error)
      throw error
    }
  },

  // Update contact status
  updateContactStatus: async (id, status, notes) => {
    try {
      const response = await api.patch(`/contact/${id}/status`, { status, notes })
      return response.data
    } catch (error) {
      console.error('Update contact status error:', error)
      throw error
    }
  },

  // Assign contact to user
  assignContact: async (id, assignedTo) => {
    try {
      const response = await api.patch(`/contact/${id}/assign`, { assignedTo })
      return response.data
    } catch (error) {
      console.error('Assign contact error:', error)
      throw error
    }
  },

  // Update contact priority
  updateContactPriority: async (id, priority) => {
    try {
      const response = await api.patch(`/contact/${id}/priority`, { priority })
      return response.data
    } catch (error) {
      console.error('Update contact priority error:', error)
      throw error
    }
  },

  // Delete contact message
  deleteContact: async (id) => {
    try {
      const response = await api.delete(`/contact/${id}`)
      return response.data
    } catch (error) {
      console.error('Delete contact error:', error)
      throw error
    }
  }
}

export default contactService
