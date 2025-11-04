import React from 'react'
import Navbar from '../components/Navbar'

const TenantDashboard = () => {
  const rentDetails = {
    current: '$1,200',
    dueDate: 'Jan 15, 2024',
    status: 'Paid',
    nextDue: 'Feb 15, 2024'
  }

  const maintenanceRequests = [
    { id: 1, issue: 'Leaky faucet', status: 'In Progress', date: '2024-01-10' },
    { id: 2, issue: 'Broken AC', status: 'Completed', date: '2024-01-05' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Tenant Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's your rental overview</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Rent Overview */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Rent Overview</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 border border-gray-200 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{rentDetails.current}</div>
                  <div className="text-sm text-gray-600">Current Rent</div>
                </div>
                <div className="text-center p-4 border border-gray-200 rounded-lg">
                  <div className="text-lg font-semibold text-gray-900">{rentDetails.dueDate}</div>
                  <div className="text-sm text-gray-600">Due Date</div>
                </div>
                <div className="text-center p-4 border border-gray-200 rounded-lg">
                  <div className="text-lg font-semibold text-green-600">{rentDetails.status}</div>
                  <div className="text-sm text-gray-600">Status</div>
                </div>
                <div className="text-center p-4 border border-gray-200 rounded-lg">
                  <div className="text-lg font-semibold text-gray-900">{rentDetails.nextDue}</div>
                  <div className="text-sm text-gray-600">Next Due</div>
                </div>
              </div>
              <div className="mt-6 flex space-x-4">
                <button className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-emerald-700 transition duration-200">
                  Pay Rent
                </button>
                <button className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-50 transition duration-200">
                  View History
                </button>
              </div>
            </div>

            {/* Maintenance Requests */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Maintenance Requests</h3>
                <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition duration-200">
                  New Request
                </button>
              </div>
              <div className="p-6">
                {maintenanceRequests.length > 0 ? (
                  <div className="space-y-4">
                    {maintenanceRequests.map((request) => (
                      <div key={request.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">{request.issue}</h4>
                          <p className="text-sm text-gray-500">Submitted on {request.date}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          request.status === 'Completed' 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {request.status}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No maintenance requests</p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Property Info */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">My Property</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Address</p>
                  <p className="font-medium text-gray-900">123 Main Street, Apt 4B</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Landlord</p>
                  <p className="font-medium text-gray-900">John Smith</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Lease End</p>
                  <p className="font-medium text-gray-900">Aug 31, 2024</p>
                </div>
              </div>
            </div>

            {/* Quick Help */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Need Help?</h3>
              <div className="space-y-3">
                <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-200">
                  <div className="font-medium text-gray-900">Contact Landlord</div>
                  <div className="text-sm text-gray-600">Send a message to your landlord</div>
                </button>
                <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-200">
                  <div className="font-medium text-gray-900">Emergency Maintenance</div>
                  <div className="text-sm text-gray-600">24/7 emergency support</div>
                </button>
                <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-200">
                  <div className="font-medium text-gray-900">Document Center</div>
                  <div className="text-sm text-gray-600">Lease agreements and documents</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TenantDashboard