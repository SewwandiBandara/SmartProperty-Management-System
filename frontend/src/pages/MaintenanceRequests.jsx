import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import maintenanceService from '../services/maintenanceService'
import propertyService from '../services/propertyService'

const MaintenanceRequests = () => {
  const [requests, setRequests] = useState([])
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [showAddRequest, setShowAddRequest] = useState(false)
  const [newRequest, setNewRequest] = useState({
    property: '',
    title: '',
    description: '',
    category: 'other',
    priority: 'medium'
  })

  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError('')

      // Fetch both maintenance requests and properties
      const [requestsResponse, propertiesResponse] = await Promise.all([
        maintenanceService.getMaintenanceRequests(),
        propertyService.getProperties()
      ])

      if (requestsResponse.success) {
        setRequests(requestsResponse.requests || [])
      }
      if (propertiesResponse.success) {
        setProperties(propertiesResponse.properties || [])
      }
    } catch (err) {
      console.error('Error fetching data:', err)
      setError('Failed to load maintenance requests')
    } finally {
      setLoading(false)
    }
  }

  const handleAddRequest = async (e) => {
    e.preventDefault()
    try {
      setError('')
      const response = await maintenanceService.createMaintenanceRequest(newRequest)
      if (response.success) {
        setRequests([response.request, ...requests])
        setNewRequest({
          property: '',
          title: '',
          description: '',
          category: 'other',
          priority: 'medium'
        })
        setShowAddRequest(false)
      }
    } catch (err) {
      console.error('Error creating maintenance request:', err)
      setError(err.response?.data?.message || 'Failed to create maintenance request')
    }
  }

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      setError('')
      const response = await maintenanceService.updateMaintenanceStatus(id, newStatus)
      if (response.success) {
        setRequests(requests.map(req =>
          req._id === id ? { ...req, status: newStatus } : req
        ))
      }
    } catch (err) {
      console.error('Error updating status:', err)
      setError(err.response?.data?.message || 'Failed to update status')
    }
  }

  const handleDeleteRequest = async (id) => {
    if (!window.confirm('Are you sure you want to delete this maintenance request?')) {
      return
    }

    try {
      setError('')
      const response = await maintenanceService.deleteMaintenanceRequest(id)
      if (response.success) {
        setRequests(requests.filter(req => req._id !== id))
      }
    } catch (err) {
      console.error('Error deleting maintenance request:', err)
      setError(err.response?.data?.message || 'Failed to delete maintenance request')
    }
  }

  // Filter requests based on status and priority
  const filteredRequests = requests.filter(req => {
    const statusMatch = filterStatus === 'all' || req.status === filterStatus
    const priorityMatch = filterPriority === 'all' || req.priority === filterPriority
    return statusMatch && priorityMatch
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'in_progress': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'plumbing': return '🚰'
      case 'electrical': return '⚡'
      case 'hvac': return '❄️'
      case 'appliance': return '🔧'
      case 'structural': return '🏗️'
      default: return '📋'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Maintenance Requests</h1>
            <p className="text-gray-600">Manage and track property maintenance requests</p>
          </div>
          <button
            onClick={() => setShowAddRequest(true)}
            className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 transition duration-200"
          >
            New Request
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Filters */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Priority</label>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-600 text-sm">Total Requests</p>
            <p className="text-2xl font-bold text-gray-900">{requests.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-600 text-sm">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">
              {requests.filter(r => r.status === 'pending').length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-600 text-sm">In Progress</p>
            <p className="text-2xl font-bold text-blue-600">
              {requests.filter(r => r.status === 'in_progress').length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-600 text-sm">Completed</p>
            <p className="text-2xl font-bold text-green-600">
              {requests.filter(r => r.status === 'completed').length}
            </p>
          </div>
        </div>

        {/* Maintenance Requests List */}
        {filteredRequests.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500 text-lg">
              {requests.length === 0
                ? 'No maintenance requests found. Create your first request to get started!'
                : 'No requests match your filters.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRequests.map((request) => (
              <div key={request._id} className="bg-white rounded-lg shadow hover:shadow-lg transition duration-300 p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{getCategoryIcon(request.category)}</span>
                      <h3 className="text-xl font-semibold text-gray-900">{request.title}</h3>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(request.status)}`}>
                        {request.status.replace('_', ' ')}
                      </span>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${getPriorityColor(request.priority)}`}>
                        {request.priority}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{request.description}</p>
                    <div className="flex gap-4 text-sm text-gray-500">
                      <span>Category: <span className="font-medium text-gray-700">{request.category}</span></span>
                      <span>Property: <span className="font-medium text-gray-700">
                        {request.property?.title || 'N/A'}
                      </span></span>
                      <span>Created: <span className="font-medium text-gray-700">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </span></span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 ml-4">
                    {request.status !== 'completed' && request.status !== 'cancelled' && (
                      <select
                        value={request.status}
                        onChange={(e) => handleStatusUpdate(request._id, e.target.value)}
                        className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    )}
                    <button
                      onClick={() => handleDeleteRequest(request._id)}
                      className="bg-red-100 text-red-700 px-3 py-1 rounded text-sm font-medium hover:bg-red-200 transition duration-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Request Modal */}
        {showAddRequest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">New Maintenance Request</h3>
              </div>
              <form onSubmit={handleAddRequest} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Property</label>
                  <select
                    required
                    value={newRequest.property}
                    onChange={(e) => setNewRequest({...newRequest, property: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">Select a property</option>
                    {properties.map((property) => (
                      <option key={property._id} value={property._id}>
                        [{property.propertyType}] {property.title} - {property.address}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={newRequest.title}
                    onChange={(e) => setNewRequest({...newRequest, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Brief description of the issue"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    required
                    value={newRequest.description}
                    onChange={(e) => setNewRequest({...newRequest, description: e.target.value})}
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Detailed description of the maintenance issue"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={newRequest.category}
                    onChange={(e) => setNewRequest({...newRequest, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="plumbing">Plumbing</option>
                    <option value="electrical">Electrical</option>
                    <option value="hvac">HVAC</option>
                    <option value="appliance">Appliance</option>
                    <option value="structural">Structural</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    value={newRequest.priority}
                    onChange={(e) => setNewRequest({...newRequest, priority: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddRequest(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md font-medium hover:bg-gray-400 transition duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-emerald-600 text-white py-2 px-4 rounded-md font-medium hover:bg-emerald-700 transition duration-200"
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MaintenanceRequests
