import React, { useState } from 'react'
import Navbar from '../components/Navbar'

const HelpCenter = () => {
  const [activeCategory, setActiveCategory] = useState('getting-started')
  const [searchQuery, setSearchQuery] = useState('')

  const categories = [
    {
      id: 'getting-started',
      name: 'Getting Started',
      icon: '🚀',
      articles: [
        {
          title: 'Creating Your Account',
          description: 'Step-by-step guide to setting up your SmartProperty account',
          popular: true
        },
        {
          title: 'Setting Up Your First Property',
          description: 'Learn how to add and configure your first property listing',
          popular: true
        },
        {
          title: 'Inviting Team Members',
          description: 'How to add team members and set permissions'
        },
        {
          title: 'Mobile App Guide',
          description: 'Getting started with our mobile application'
        }
      ]
    },
    {
      id: 'property-management',
      name: 'Property Management',
      icon: '🏠',
      articles: [
        {
          title: 'Adding Property Listings',
          description: 'Complete guide to creating and managing property listings',
          popular: true
        },
        {
          title: 'Managing Tenant Information',
          description: 'How to add and manage tenant profiles'
        },
        {
          title: 'Lease Agreement Templates',
          description: 'Using and customizing lease agreement templates'
        },
        {
          title: 'Property Photos Best Practices',
          description: 'Tips for taking great property photos'
        }
      ]
    },
    {
      id: 'payments',
      name: 'Payments & Billing',
      icon: '💳',
      articles: [
        {
          title: 'Setting Up Rent Collection',
          description: 'Configure automatic rent collection from tenants',
          popular: true
        },
        {
          title: 'Payment Methods Explained',
          description: 'Understanding different payment options available'
        },
        {
          title: 'Managing Invoices',
          description: 'Create and send professional invoices to tenants'
        },
        {
          title: 'Payment Disputes',
          description: 'How to handle payment disputes and issues'
        }
      ]
    },
    {
      id: 'maintenance',
      name: 'Maintenance',
      icon: '🔧',
      articles: [
        {
          title: 'Submitting Maintenance Requests',
          description: 'How tenants can submit maintenance requests',
          popular: true
        },
        {
          title: 'Managing Maintenance Workflows',
          description: 'Streamline maintenance request processing'
        },
        {
          title: 'Vendor Management',
          description: 'Adding and managing maintenance vendors'
        },
        {
          title: 'Emergency Maintenance',
          description: 'Handling urgent maintenance situations'
        }
      ]
    },
    {
      id: 'account-settings',
      name: 'Account & Settings',
      icon: '⚙️',
      articles: [
        {
          title: 'Updating Profile Information',
          description: 'How to manage your account profile and settings'
        },
        {
          title: 'Notification Preferences',
          description: 'Customize your email and push notification settings'
        },
        {
          title: 'Security Settings',
          description: 'Manage password, 2FA, and account security'
        },
        {
          title: 'Billing & Subscription',
          description: 'Manage your subscription plan and billing information'
        }
      ]
    },
    {
      id: 'troubleshooting',
      name: 'Troubleshooting',
      icon: '🔍',
      articles: [
        {
          title: 'Login Issues',
          description: 'Solutions for common login problems',
          popular: true
        },
        {
          title: 'Payment Processing Errors',
          description: 'Troubleshoot payment-related issues'
        },
        {
          title: 'App Performance',
          description: 'Improve app performance and fix common issues'
        },
        {
          title: 'Browser Compatibility',
          description: 'Supported browsers and compatibility information'
        }
      ]
    }
  ]

  const popularArticles = categories.flatMap(category => 
    category.articles.filter(article => article.popular)
  )

  const currentCategory = categories.find(cat => cat.id === activeCategory)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            How can we help you?
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Find answers to common questions, guides, and troubleshooting tips for SmartProperty.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for help articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-lg"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Popular Articles */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularArticles.map((article, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300 cursor-pointer">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-emerald-600 text-sm">📖</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">{article.title}</h3>
                    <p className="text-gray-600 text-sm">{article.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <h3 className="font-semibold text-gray-900 mb-4">Help Categories</h3>
              <nav className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition duration-200 ${
                      activeCategory === category.id
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{category.icon}</span>
                      <span className="font-medium">{category.name}</span>
                    </div>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Articles List */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center space-x-3 mb-6">
                <span className="text-2xl">{currentCategory.icon}</span>
                <h2 className="text-2xl font-bold text-gray-900">{currentCategory.name}</h2>
              </div>
              
              <div className="space-y-4">
                {currentCategory.articles.map((article, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-6 hover:border-emerald-300 hover:bg-emerald-50 transition duration-200 cursor-pointer group">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-emerald-700 transition duration-200">
                          {article.title}
                        </h3>
                        <p className="text-gray-600 text-sm">{article.description}</p>
                      </div>
                      {article.popular && (
                        <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs font-medium ml-4 flex-shrink-0">
                          Popular
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Support */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-8 mt-8 text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Still need help?</h3>
              <p className="text-gray-600 mb-4">
                Our support team is here to assist you with any questions or issues.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 transition duration-200">
                  Contact Support
                </button>
                <button className="border border-emerald-600 text-emerald-600 px-6 py-3 rounded-lg font-medium hover:bg-emerald-600 hover:text-white transition duration-200">
                  Schedule a Call
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Help Links */}
      <div className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 text-xl">📚</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Documentation</h3>
              <p className="text-gray-600 text-sm">Comprehensive guides and API documentation</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 text-xl">🎥</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Video Tutorials</h3>
              <p className="text-gray-600 text-sm">Step-by-step video guides and walkthroughs</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-purple-600 text-xl">👥</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Community</h3>
              <p className="text-gray-600 text-sm">Join discussions with other users</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HelpCenter