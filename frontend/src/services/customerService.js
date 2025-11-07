import api from './api'

const customerService = {
  // Browse properties with advanced filters
  browseProperties: async (params) => {
    try {
      const response = await api.get('/customer/browse-properties', { params })
      return response.data
    } catch (error) {
      console.error('Browse properties error:', error)
      throw error
    }
  },

  // Get property details
  getPropertyDetails: async (propertyId) => {
    try {
      const response = await api.get(`/customer/property/${propertyId}`)
      return response.data
    } catch (error) {
      console.error('Get property details error:', error)
      throw error
    }
  },

  // Get favorite properties
  getFavorites: async () => {
    try {
      const response = await api.get('/customer/favorites')
      return response.data
    } catch (error) {
      console.error('Get favorites error:', error)
      throw error
    }
  },

  // Add to favorites
  addToFavorites: async (propertyId) => {
    try {
      const response = await api.post(`/customer/favorites/${propertyId}`)
      return response.data
    } catch (error) {
      console.error('Add to favorites error:', error)
      throw error
    }
  },

  // Remove from favorites
  removeFromFavorites: async (propertyId) => {
    try {
      const response = await api.delete(`/customer/favorites/${propertyId}`)
      return response.data
    } catch (error) {
      console.error('Remove from favorites error:', error)
      throw error
    }
  },

  // Send inquiry to agent/owner
  sendInquiry: async (inquiryData) => {
    try {
      const response = await api.post('/customer/contact-inquiry', inquiryData)
      return response.data
    } catch (error) {
      console.error('Send inquiry error:', error)
      throw error
    }
  }
}

export default customerService
