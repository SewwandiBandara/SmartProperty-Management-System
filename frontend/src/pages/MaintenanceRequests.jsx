import React, { useState } from 'react'
import Navbar from '../components/Navbar'

const MaintenanceRequests = () => {
  const [requests, setRequests] = useState([
    {
      id: 1,
      title: 'Leaky Kitchen Faucet',
      description: 'Water dripping from kitchen faucet handle',
      priority: 'Medium',
      status: 'In Progress',
      submitted: '2024-01-10',
      assignedTo: 'Maintenance Team A'
    },
    {
      id: 2,
      title: 'Broken AC Unit',
      description: 'Air conditioning not cooling properly',
      priority: 'High',
      status: 'Completed',
      submitted: '2024-01-05',
      assignedTo: 'HVAC Specialist'
    },
    {
      id: 3,
      title: 'Peeling Paint',
      description: 'Paint peeling in living room wall',
      priority: 'Low',
      status: 'Pending',
      submitted: '2024-01-12',
      assignedTo: 'Not assigned'
    }
  ])

  const [showNewRequest, setShowNewRequest] = useState(false)
  const [newRequest, setNewRequest] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    location: ''
  })

  const handleSubmitRequest = (e) => {
    e.preventDefault()
    const request = {
      id: requests.length + 1,
      ...newRequest,
      status: 'Pending',
      submitted: new Date().toISOString().split('T')[0],
      assignedTo: 'Not assigned'
    }
    setRequests([...requests, request])
    setNewRequest({ title: '', description: '', priority: 'Medium', location: '' })
    setShowNewRequest(false)
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800'
      case 'Medium': return 'bg-yellow-100 text-yellow-800'
      case 'Low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800'
      case 'In Progress': return 'bg-blue-100 text-blue-800'
      case 'Pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Maintenance Requests</h1>
            <p className="text-gray-600">Submit and track maintenance issues</p>
          </div>
          <button 
            onClick={() => setShowNewRequest(true)}
            className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 transition duration-200"
          >
            New Request
          </button>
        </div>

        {/* Requests List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">All Requests</h3>
          </div>
          <div className="p-6">
            {requests.length > 0 ? (
              <div className="space-y-4">
                {requests.map((request) => (
                  <div key={request.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition duration-200">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">{request.title}</h4>
                        <p className="text-gray-600 text-sm mt-1">{request.description}</p>
                      </div>
                      <div className="flex space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(request.priority)}`}>
                          {request.priority}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                          {request.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex space-x-4">
                        <span>Submitted: {request.submitted}</span>
                        <span>Assigned to: {request.assignedTo}</span>
                      </div>
                      <div className="flex space-x-2">
                        <button className="text-emerald-600 hover:text-emerald-700 font-medium">
                          Update
                        </button>
                        <button className="text-gray-600 hover:text-gray-700 font-medium">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No maintenance requests found</p>
                <button 
                  onClick={() => setShowNewRequest(true)}
                  className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition duration-200"
                >
                  Submit Your First Request
                </button>
              </div>
            )}
          </div>
        </div>

        {/* New Request Modal */}
        {showNewRequest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Submit Maintenance Request</h3>
              </div>
              <form onSubmit={handleSubmitRequest} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Issue Title</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    required
                    value={newRequest.location}
                    onChange={(e) => setNewRequest({...newRequest, location: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Where is the issue located?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    value={newRequest.priority}
                    onChange={(e) => setNewRequest({...newRequest, priority: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Low">Low - Minor issue</option>
                    <option value="Medium">Medium - Needs attention</option>
                    <option value="High">High - Urgent issue</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Detailed Description</label>
                  <textarea
                    required
                    value={newRequest.description}
                    onChange={(e) => setNewRequest({...newRequest, description: e.target.value})}
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Please provide detailed information about the issue..."
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowNewRequest(false)}
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