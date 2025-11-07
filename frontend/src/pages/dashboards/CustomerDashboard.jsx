import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Navbar from '../../components/Navbar'
import customerService from '../../services/customerService'
import contactService from '../../services/contactService'
import leadService from '../../services/leadService'
import leaseService from '../../services/leaseService'
import maintenanceService from '../../services/maintenanceService'

const CustomerDashboard = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [properties, setProperties] = useState([])
  const [favorites, setFavorites] = useState([])
  const [contacts, setContacts] = useState([])
  const [leads, setLeads] = useState([])
  const [leases, setLeases] = useState([])
  const [maintenanceRequests, setMaintenanceRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const [selectedProperty, setSelectedProperty] = useState(null)
  const [showPropertyDetails, setShowPropertyDetails] = useState(false)
  const [showInquiryModal, setShowInquiryModal] = useState(false)
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false)
  const [similarProperties, setSimilarProperties] = useState([])

  const [maintenanceForm, setMaintenanceForm] = useState({
    property: '',
    title: '',
    description: '',
    category: 'other',
    priority: 'medium'
  })

  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('available')
  const [priceRange, setPriceRange] = useState('all')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [bedrooms, setBedrooms] = useState('')
  const [location, setLocation] = useState('')

  const [inquiryForm, setInquiryForm] = useState({
    message: '',
    preferredContactTime: ''
  })

  useEffect(() => {
    fetchProperties()
    fetchFavorites()
    fetchContacts()
    fetchLeads()
    fetchLeases()
    fetchMaintenanceRequests()
  }, [])

  const fetchProperties = async () => {
    try {
      setLoading(true)
      setError('')

      const params = {}
      if (filterType && filterType !== 'all') params.propertyType = filterType
      if (filterStatus && filterStatus !== 'all') params.status = filterStatus
      if (minPrice) params.minPrice = minPrice
      if (maxPrice) params.maxPrice = maxPrice
      if (bedrooms) params.bedrooms = bedrooms
      if (location) params.location = location
      if (searchTerm) params.search = searchTerm

      const response = await customerService.browseProperties(params)
      if (response.success) {
        setProperties(response.properties || [])
      }
    } catch (err) {
      console.error('Error fetching properties:', err)
      setError('Failed to load properties')
    } finally {
      setLoading(false)
    }
  }

  const fetchFavorites = async () => {
    try {
      const response = await customerService.getFavorites()
      if (response.success) {
        setFavorites(response.favorites || [])
      }
    } catch (err) {
      console.error('Error fetching favorites:', err)
    }
  }

  const fetchContacts = async () => {
    try {
      const response = await contactService.getAllContacts()
      if (response.success) {
        // Filter to show only user's own contacts
        const userContacts = response.contacts.filter(
          contact => contact.user?._id === user?.id || contact.email === user?.email
        )
        setContacts(userContacts || [])
      }
    } catch (err) {
      console.error('Error fetching contacts:', err)
    }
  }

  const fetchLeads = async () => {
    try {
      const response = await leadService.getLeads()
      if (response.success) {
        // Filter to show only user's own leads
        const userLeads = response.leads.filter(
          lead => lead.customer?._id === user?.id || lead.email === user?.email
        )
        setLeads(userLeads || [])
      }
    } catch (err) {
      console.error('Error fetching leads:', err)
    }
  }

  const fetchLeases = async () => {
    try {
      const response = await leaseService.getLeases()
      if (response.success) {
        setLeases(response.leases || [])
      }
    } catch (err) {
      console.error('Error fetching leases:', err)
    }
  }

  const fetchMaintenanceRequests = async () => {
    try {
      const response = await maintenanceService.getMaintenanceRequests()
      if (response.success) {
        // Filter to show only user's own maintenance requests
        const userRequests = response.requests.filter(
          request => request.customer?._id === user?.id
        )
        setMaintenanceRequests(userRequests || [])
      }
    } catch (err) {
      console.error('Error fetching maintenance requests:', err)
    }
  }

  const handleViewDetails = async (property) => {
    try {
      const response = await customerService.getPropertyDetails(property._id)
      if (response.success) {
        setSelectedProperty(response.property)
        setSimilarProperties(response.similarProperties || [])
        setShowPropertyDetails(true)
      }
    } catch (err) {
      console.error('Error fetching property details:', err)
      setError('Failed to load property details')
    }
  }

  const handleToggleFavorite = async (propertyId, e) => {
    e.stopPropagation()

    try {
      const isFavorite = favorites.some(fav => fav._id === propertyId)

      if (isFavorite) {
        await customerService.removeFromFavorites(propertyId)
        setFavorites(favorites.filter(fav => fav._id !== propertyId))
        setSuccessMessage('Removed from favorites')
      } else {
        await customerService.addToFavorites(propertyId)
        const property = properties.find(p => p._id === propertyId)
        setFavorites([...favorites, property])
        setSuccessMessage('Added to favorites')
      }

      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (err) {
      console.error('Error toggling favorite:', err)
      setError('Failed to update favorites')
    }
  }

  const handleSendInquiry = async (e) => {
    e.preventDefault()

    try {
      const inquiryData = {
        propertyId: selectedProperty._id,
        ...inquiryForm
      }
      const response = await customerService.sendInquiry(inquiryData)
      if (response.success) {
        setSuccessMessage('Inquiry sent successfully!')
        setShowInquiryModal(false)
        setInquiryForm({ message: '', preferredContactTime: '' })
        setTimeout(() => setSuccessMessage(''), 3000)
      }
    } catch (err) {
      console.error('Error sending inquiry:', err)
      setError('Failed to send inquiry')
      setTimeout(() => setError(''), 3000)
    }
  }

  const handleSearch = () => {
    fetchProperties()
  }

  const handleClearFilters = () => {
    setSearchTerm('')
    setFilterType('all')
    setFilterStatus('available')
    setPriceRange('all')
    setMinPrice('')
    setMaxPrice('')
    setBedrooms('')
    setLocation('')
    fetchProperties()
  }

  const handleApproveLease = async (leaseId) => {
    try {
      const response = await leaseService.approveLeaseAsCustomer(leaseId)
      if (response.success) {
        setSuccessMessage('Lease approved successfully!')
        fetchLeases()
        setTimeout(() => setSuccessMessage(''), 3000)
      }
    } catch (err) {
      console.error('Error approving lease:', err)
      setError('Failed to approve lease')
      setTimeout(() => setError(''), 3000)
    }
  }

  const handleCreateMaintenanceRequest = async (e) => {
    e.preventDefault()

    try {
      const response = await maintenanceService.createMaintenanceRequest(maintenanceForm)
      if (response.success) {
        setSuccessMessage('Maintenance request submitted successfully!')
        setShowMaintenanceModal(false)
        setMaintenanceForm({
          property: '',
          title: '',
          description: '',
          category: 'other',
          priority: 'medium'
        })
        fetchMaintenanceRequests()
        setTimeout(() => setSuccessMessage(''), 3000)
      }
    } catch (err) {
      console.error('Error creating maintenance request:', err)
      setError('Failed to submit maintenance request')
      setTimeout(() => setError(''), 3000)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const availableProperties = properties.filter(p => p.status === 'available')
  const avgPrice = availableProperties.length > 0
    ? (availableProperties.reduce((sum, p) => sum + (p.price || 0), 0) / availableProperties.length).toFixed(0)
    : 0

  const isFavorite = (propertyId) => {
    return favorites.some(fav => fav._id === propertyId)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome, {user?.firstName} {user?.lastName}!
              </h1>
              <p className="text-gray-600 mt-2">Customer Dashboard - Find Your Perfect Property</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200"
            >
              Logout
            </button>
          </div>

          {/* Success/Error Messages */}
          {successMessage && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              {successMessage}
            </div>
          )}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-xl border border-emerald-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-600 text-sm font-medium">Available Properties</p>
                  <p className="text-3xl font-bold text-emerald-900 mt-2">{availableProperties.length}</p>
                </div>
                <div className="w-12 h-12 bg-emerald-200 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Average Price</p>
                  <p className="text-3xl font-bold text-blue-900 mt-2">RS:{avgPrice}</p>
                </div>
                <div className="w-12 h-12 bg-blue-200 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Total Listings</p>
                  <p className="text-3xl font-bold text-purple-900 mt-2">{properties.length}</p>
                </div>
                <div className="w-12 h-12 bg-purple-200 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-6 rounded-xl border border-pink-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-pink-600 text-sm font-medium">My Favorites</p>
                  <p className="text-3xl font-bold text-pink-900 mt-2">{favorites.length}</p>
                </div>
                <div className="w-12 h-12 bg-pink-200 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-pink-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-50 p-6 rounded-xl mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

              <button
                onClick={() => navigate('/maintenance')}
                className="bg-white p-4 rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-md transition duration-200"
              >
                <div className="text-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-gray-900">Maintenance</p>
                </div>
              </button>

              <button
                onClick={() => navigate('/payment')}
                className="bg-white p-4 rounded-lg border border-gray-200 hover:border-purple-500 hover:shadow-md transition duration-200"
              >
                <div className="text-center">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-gray-900">Payments</p>
                </div>
              </button>

              <button
                onClick={() => navigate('/contact')}
                className="bg-white p-4 rounded-lg border border-gray-200 hover:border-orange-500 hover:shadow-md transition duration-200"
              >
                <div className="text-center">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-gray-900">Contact Us</p>
                </div>
              </button>
            </div>
          </div>

          {/* Contact History */}
          {contacts.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">My Contact Messages</h2>
              <div className="space-y-4">
                {contacts.slice(0, 3).map((contact) => (
                  <div key={contact._id} className="border border-gray-200 rounded-lg p-4 hover:border-emerald-500 transition duration-200">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{contact.subject}</h3>
                        <p className="text-sm text-gray-600 mt-1">{contact.message.substring(0, 100)}{contact.message.length > 100 ? '...' : ''}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        contact.status === 'new' ? 'bg-blue-100 text-blue-800' :
                        contact.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                        contact.status === 'resolved' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {contact.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                      <span>Sent: {new Date(contact.createdAt).toLocaleDateString()}</span>
                      {contact.priority && (
                        <span className={`font-medium ${
                          contact.priority === 'urgent' ? 'text-red-600' :
                          contact.priority === 'high' ? 'text-orange-600' :
                          contact.priority === 'medium' ? 'text-yellow-600' :
                          'text-gray-600'
                        }`}>
                          Priority: {contact.priority.toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {contacts.length > 3 && (
                <div className="mt-4 text-center">
                  <button
                    onClick={() => navigate('/contact')}
                    className="text-emerald-600 hover:text-emerald-700 font-medium text-sm"
                  >
                    View all {contacts.length} messages →
                  </button>
                </div>
              )}
            </div>
          )}

          {/* My Property Inquiries/Leads */}
          {leads.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">My Property Inquiries</h2>
              <div className="space-y-4">
                {leads.slice(0, 3).map((lead) => (
                  <div key={lead._id} className="border border-gray-200 rounded-lg p-4 hover:border-emerald-500 transition duration-200">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900">{lead.leadType.replace('_', ' ').toUpperCase()} Inquiry</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            lead.status === 'new' ? 'bg-blue-100 text-blue-800' :
                            lead.status === 'contacted' ? 'bg-yellow-100 text-yellow-800' :
                            lead.status === 'qualified' ? 'bg-purple-100 text-purple-800' :
                            lead.status === 'converted' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {lead.status.toUpperCase()}
                          </span>
                        </div>
                        {lead.interestedProperties && lead.interestedProperties.length > 0 && (
                          <p className="text-sm text-gray-600 mt-1">
                            Interested in {lead.interestedProperties.length} {lead.interestedProperties.length === 1 ? 'property' : 'properties'}
                          </p>
                        )}
                        {lead.budget && (
                          <p className="text-sm text-gray-600 mt-1">
                            Budget: ${lead.budget.min?.toLocaleString()} - ${lead.budget.max?.toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      <span>Submitted: {new Date(lead.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
              {leads.length > 3 && (
                <div className="mt-4 text-center">
                  <span className="text-emerald-600 font-medium text-sm">
                    Total {leads.length} inquiries
                  </span>
                </div>
              )}
            </div>
          )}

          {/* My Leases */}
          {leases.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">My Leases</h2>
              <div className="space-y-4">
                {leases.map((lease) => (
                  <div key={lease._id} className="border border-gray-200 rounded-lg p-4 hover:border-emerald-500 transition duration-200">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-gray-900">{lease.property?.title}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            lease.status === 'active' ? 'bg-green-100 text-green-800' :
                            lease.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            lease.status === 'expired' ? 'bg-gray-100 text-gray-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {lease.status.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{lease.property?.address}</p>
                        {lease.manager && (
                          <p className="text-xs text-gray-500 mt-1">
                            Property Manager: {lease.manager?.firstName} {lease.manager?.lastName}
                            {lease.manager?.phone && ` • ${lease.manager.phone}`}
                          </p>
                        )}
                        <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                          <div>
                            <span className="text-gray-500">Start Date:</span>{' '}
                            <span className="text-gray-900">{new Date(lease.startDate).toLocaleDateString()}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">End Date:</span>{' '}
                            <span className="text-gray-900">{new Date(lease.endDate).toLocaleDateString()}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Monthly Rent:</span>{' '}
                            <span className="text-gray-900 font-semibold">${lease.monthlyRent?.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Security Deposit:</span>{' '}
                            <span className="text-gray-900">${lease.securityDeposit?.toLocaleString()}</span>
                          </div>
                        </div>
                        {lease.terms && (
                          <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                            <span className="font-semibold text-gray-700">Lease Terms:</span>
                            <p className="text-gray-600 mt-1 whitespace-pre-wrap">{lease.terms}</p>
                          </div>
                        )}
                        <div className="mt-3">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded text-xs ${lease.approvedByManager ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                              Manager Approval: {lease.approvedByManager ? '✓' : 'Pending'}
                            </span>
                            <span className={`px-2 py-1 rounded text-xs ${lease.approvedByCustomer ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                              Your Approval: {lease.approvedByCustomer ? '✓' : 'Pending'}
                            </span>
                          </div>
                          {lease.signedAt && (
                            <p className="text-xs text-gray-500 mt-1">
                              Lease signed on: {new Date(lease.signedAt).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        {!lease.approvedByCustomer && lease.status === 'pending' && (
                          <div className="mt-3">
                            <button
                              onClick={() => handleApproveLease(lease._id)}
                              className="px-4 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 transition"
                            >
                              Approve Lease
                            </button>
                            <p className="text-xs text-gray-500 mt-1">
                              By clicking approve, you agree to the lease terms and conditions above.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Maintenance Requests */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">My Maintenance Requests</h2>
              <button
                onClick={() => setShowMaintenanceModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 font-medium"
              >
                + Submit Request
              </button>
            </div>
            {maintenanceRequests.length > 0 ? (
              <div className="space-y-4">
                {maintenanceRequests.slice(0, 5).map((request) => (
                  <div key={request._id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition duration-200">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-gray-900">{request.title}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            request.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                            request.status === 'completed' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {request.status.replace('_', ' ').toUpperCase()}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            request.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                            request.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                            request.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {request.priority.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{request.property?.title} - {request.property?.address}</p>
                        <p className="text-sm text-gray-700 mb-2">{request.description}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>Category: {request.category}</span>
                          <span>Submitted: {new Date(request.createdAt).toLocaleDateString()}</span>
                          {request.completedDate && (
                            <span>Completed: {new Date(request.completedDate).toLocaleDateString()}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p>No maintenance requests yet</p>
                <p className="text-sm mt-2">Click "Submit Request" to create your first maintenance request</p>
              </div>
            )}
          </div>
        </div>

        {/* Property Browser Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse Properties</h2>

          {/* Search and Filters */}
          <div className="mb-6 space-y-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by title, address, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">All Types</option>
                <option value="Apartment">Apartment</option>
                <option value="House">House</option>
                <option value="Condo">Condo</option>
                <option value="Townhouse">Townhouse</option>
                <option value="Villa">Villa</option>
                <option value="Studio">Studio</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">All Status</option>
                <option value="available">Available</option>
                <option value="occupied">Occupied</option>
                <option value="maintenance">Maintenance</option>
              </select>

              <input
                type="number"
                placeholder="Min Price"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />

              <input
                type="number"
                placeholder="Max Price"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />

              <select
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">Any Bedrooms</option>
                <option value="1">1 Bedroom</option>
                <option value="2">2 Bedrooms</option>
                <option value="3">3 Bedrooms</option>
                <option value="4">4+ Bedrooms</option>
              </select>
            </div>

            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Location (city, area, etc.)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                onClick={handleSearch}
                className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition duration-200 font-medium"
              >
                Search
              </button>
              <button
                onClick={handleClearFilters}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-200 font-medium"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            </div>
          ) : (
            <>
              {/* Properties Grid */}
              {properties.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <p className="text-gray-500 text-lg">No properties found matching your criteria.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {properties.map((property) => (
                    <div key={property._id} className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden hover:shadow-xl transition duration-300 relative">
                      {/* Favorite Button */}
                      <button
                        onClick={(e) => handleToggleFavorite(property._id, e)}
                        className="absolute top-3 right-3 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition duration-200"
                      >
                        <svg
                          className={`w-6 h-6 ${isFavorite(property._id) ? 'text-pink-600 fill-current' : 'text-gray-400'}`}
                          fill={isFavorite(property._id) ? 'currentColor' : 'none'}
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>

                      <img
                        src={property.images?.[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'}
                        alt={property.title}
                        className="w-full h-48 object-cover cursor-pointer"
                        onClick={() => handleViewDetails(property)}
                      />
                      <div className="p-5">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 flex-1">{property.title}</h3>
                          <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${
                            property.status === 'available' ? 'bg-green-100 text-green-800' :
                            property.status === 'occupied' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {property.status}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-1">{property.propertyType}</p>
                        <p className="text-gray-600 text-sm mb-3">{property.address}</p>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{property.description}</p>
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                          <span>{property.bedrooms} beds</span>
                          <span>{property.bathrooms} baths</span>
                          <span>{property.area} sq ft</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-emerald-600">RS:{property.price}<span className="text-sm text-gray-500">/mo</span></span>
                          <button
                            onClick={() => handleViewDetails(property)}
                            className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition duration-200"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Property Details Modal */}
        {showPropertyDetails && selectedProperty && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-2xl font-bold text-gray-900">{selectedProperty.title}</h3>
                <button
                  onClick={() => setShowPropertyDetails(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-6">
                <img
                  src={selectedProperty.images?.[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                  alt={selectedProperty.title}
                  className="w-full h-96 object-cover rounded-lg mb-6"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Property Details</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Type:</span>
                        <span className="font-medium text-gray-900">{selectedProperty.propertyType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          selectedProperty.status === 'available' ? 'bg-green-100 text-green-800' :
                          selectedProperty.status === 'occupied' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {selectedProperty.status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Bedrooms:</span>
                        <span className="font-medium text-gray-900">{selectedProperty.bedrooms}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Bathrooms:</span>
                        <span className="font-medium text-gray-900">{selectedProperty.bathrooms}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Area:</span>
                        <span className="font-medium text-gray-900">{selectedProperty.area} sq ft</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Price:</span>
                        <span className="font-bold text-emerald-600 text-xl">RS:{selectedProperty.price}/mo</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Location</h4>
                    <p className="text-gray-700 mb-4">{selectedProperty.address}</p>

                    {selectedProperty.amenities && selectedProperty.amenities.length > 0 && (
                      <>
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Amenities</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedProperty.amenities.map((amenity, index) => (
                            <span key={index} className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm">
                              {amenity}
                            </span>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Description</h4>
                  <p className="text-gray-700 leading-relaxed">{selectedProperty.description}</p>
                </div>

                {/* Similar Properties */}
                {similarProperties && similarProperties.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Similar Properties</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {similarProperties.slice(0, 3).map((similar) => (
                        <div key={similar._id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition cursor-pointer" onClick={() => handleViewDetails(similar)}>
                          <img
                            src={similar.images?.[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'}
                            alt={similar.title}
                            className="w-full h-32 object-cover"
                          />
                          <div className="p-3">
                            <h5 className="font-semibold text-sm text-gray-900 mb-1">{similar.title}</h5>
                            <p className="text-xs text-gray-600 mb-2">{similar.address}</p>
                            <p className="text-lg font-bold text-emerald-600">RS:{similar.price}/mo</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setShowPropertyDetails(false)
                      setShowInquiryModal(true)
                    }}
                    className="flex-1 bg-emerald-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-emerald-700 transition duration-200"
                  >
                    Send Inquiry
                  </button>
                  <button
                    onClick={(e) => {
                      handleToggleFavorite(selectedProperty._id, e)
                    }}
                    className={`flex-1 py-3 px-4 rounded-lg font-medium transition duration-200 ${
                      isFavorite(selectedProperty._id)
                        ? 'bg-pink-600 text-white hover:bg-pink-700'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {isFavorite(selectedProperty._id) ? 'Remove from Favorites' : 'Add to Favorites'}
                  </button>
                  <button
                    onClick={() => setShowPropertyDetails(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-400 transition duration-200"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Inquiry Modal */}
        {showInquiryModal && selectedProperty && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-2xl font-bold text-gray-900">Send Inquiry</h3>
                <button
                  onClick={() => setShowInquiryModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSendInquiry} className="p-6">
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-4">
                    Inquiring about: <span className="font-semibold text-gray-900">{selectedProperty.title}</span>
                  </p>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={inquiryForm.message}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                    rows="5"
                    required
                    placeholder="I'm interested in this property. Please provide more details..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  ></textarea>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Contact Time
                  </label>
                  <input
                    type="text"
                    value={inquiryForm.preferredContactTime}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, preferredContactTime: e.target.value })}
                    placeholder="e.g., Weekdays 9AM-5PM"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-emerald-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-emerald-700 transition duration-200"
                  >
                    Send Inquiry
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowInquiryModal(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-400 transition duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Maintenance Request Modal */}
        {showMaintenanceModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
                <h3 className="text-2xl font-bold text-gray-900">Submit Maintenance Request</h3>
                <button
                  onClick={() => setShowMaintenanceModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleCreateMaintenanceRequest} className="p-6">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={maintenanceForm.property}
                    onChange={(e) => setMaintenanceForm({ ...maintenanceForm, property: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a property</option>
                    {leases
                      .filter(lease => lease.status === 'active')
                      .map((lease) => (
                        <option key={lease._id} value={lease.property._id}>
                          {lease.property.title} - {lease.property.address}
                        </option>
                      ))
                    }
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Select from your active leased properties</p>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Issue Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={maintenanceForm.title}
                    onChange={(e) => setMaintenanceForm({ ...maintenanceForm, title: e.target.value })}
                    required
                    placeholder="e.g., Leaking faucet in kitchen"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={maintenanceForm.description}
                    onChange={(e) => setMaintenanceForm({ ...maintenanceForm, description: e.target.value })}
                    rows="5"
                    required
                    placeholder="Please provide detailed information about the issue..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={maintenanceForm.category}
                    onChange={(e) => setMaintenanceForm({ ...maintenanceForm, category: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="plumbing">Plumbing</option>
                    <option value="electrical">Electrical</option>
                    <option value="hvac">HVAC</option>
                    <option value="appliance">Appliance</option>
                    <option value="structural">Structural</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={maintenanceForm.priority}
                    onChange={(e) => setMaintenanceForm({ ...maintenanceForm, priority: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Low - Can wait</option>
                    <option value="medium">Medium - Regular maintenance</option>
                    <option value="high">High - Needs attention soon</option>
                    <option value="urgent">Urgent - Immediate attention required</option>
                  </select>
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition duration-200"
                  >
                    Submit Request
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowMaintenanceModal(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-400 transition duration-200"
                  >
                    Cancel
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

export default CustomerDashboard
