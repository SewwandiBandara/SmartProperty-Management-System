import api from './api'

const propertyService = {
  // Get all properties for authenticated user
  getProperties: async () => {
    try {
      const response = await api.get('/properties')
      return response.data
    } catch (error) {
      console.error('Get properties error:', error)
      throw error
    }
  },

  // Get single property by ID
  getPropertyById: async (id) => {
    try {
      const response = await api.get(`/properties/${id}`)
      return response.data
    } catch (error) {
      console.error('Get property error:', error)
      throw error
    }
  },

  // Create new property
  createProperty: async (propertyData) => {
    try {
      const response = await api.post('/properties', propertyData)
      return response.data
    } catch (error) {
      console.error('Create property error:', error)
      throw error
    }
  },

  // Update property
  updateProperty: async (id, propertyData) => {
    try {
      const response = await api.put(`/properties/${id}`, propertyData)
      return response.data
    } catch (error) {
      console.error('Update property error:', error)
      throw error
    }
  },

  // Delete property
  deleteProperty: async (id) => {
    try {
      const response = await api.delete(`/properties/${id}`)
      return response.data
    } catch (error) {
      console.error('Delete property error:', error)
      throw error
    }
  }
}

export default propertyService
