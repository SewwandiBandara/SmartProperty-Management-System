import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FcBiohazard } from "react-icons/fc";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const location = useLocation()

  // Navigation items with their paths
  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/features', label: 'Features' },
    { path: '/pricing', label: 'Pricing' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' }
  ]

  // Update active section based on current route
  useEffect(() => {
    const currentPath = location.pathname
    const currentItem = navItems.find(item => item.path === currentPath)
    setActiveSection(currentItem ? currentItem.path : '')
  }, [location.pathname])

  // Navigation link component with active state
  const NavLink = ({ to, children }) => {
    const isActive = activeSection === to
    
    return (
      <Link 
        to={to} 
        className={`relative px-3 py-2 rounded-md text-sm font-medium transition duration-300 ${
          isActive 
            ? 'text-emerald-600' 
            : 'text-gray-600 hover:text-emerald-600'
        }`}
        onClick={() => {
          setActiveSection(to)
          setIsMobileMenuOpen(false)
        }}
      >
        {children}
        {/* Animated underline for active state */}
        {isActive && (
          <span className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-600 transform origin-left transition-transform duration-300"></span>
        )}
        {/* Hover underline effect */}
        <span className={`absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-600 transition-all duration-300 ${
          !isActive ? 'group-hover:w-full' : ''
        }`}></span>
      </Link>
    )
  }

  // Mobile navigation link component
  const MobileNavLink = ({ to, children }) => {
    const isActive = activeSection === to
    
    return (
      <Link 
        to={to} 
        className={`block px-3 py-2 rounded-md text-base font-medium transition duration-300 ${
          isActive 
            ? 'text-emerald-600 bg-emerald-50' 
            : 'text-gray-600 hover:text-emerald-600 hover:bg-gray-50'
        }`}
        onClick={() => {
          setActiveSection(to)
          setIsMobileMenuOpen(false)
        }}
      >
        {children}
      </Link>
    )
  }

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link 
              to="/" 
              className="flex-shrink-0 flex items-center group"
              onClick={() => setActiveSection('/')}
            >
              <div className="h-8 w-8 bg-emerald-100 rounded-lg flex items-center justify-center group-hover:bg-emerald-200 transition duration-300">
                {/* <span className="text-white font-bold text-sm">SP</span> */}
                <FcBiohazard />
              </div>
              <span className="ml-2 text-xl  font-bold text-emerald-950 group-hover:text-emerald-600 transition duration-300">
                SmartProperty
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <div key={item.path} className="group">
                <NavLink to={item.path}>
                  {item.label}
                </NavLink>
              </div>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              to="/login" 
              className="text-gray-600 hover:text-emerald-600 px-3 py-2 rounded-md text-sm font-medium transition duration-300 relative group"
            >
              Login
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link 
              to="/register" 
              className="bg-emerald-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-emerald-700 transition duration-300 transform hover:scale-105"
              onClick={() => setActiveSection('')}
            >
              Get Started
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-500 transition duration-300"
            >
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              {navItems.map((item) => (
                <MobileNavLink key={item.path} to={item.path}>
                  {item.label}
                </MobileNavLink>
              ))}
              <div className="border-t pt-4 space-y-1">
                <Link 
                  to="/login" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-emerald-600 hover:bg-gray-50 transition duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="block px-3 py-2 rounded-md text-base font-medium bg-emerald-600 text-white hover:bg-emerald-700 transition duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar