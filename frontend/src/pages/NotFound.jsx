import React from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
        <div className="text-center">
          <h1 className="text-9xl font-bold text-emerald-600">404</h1>
          <h2 className="text-3xl font-bold text-gray-900 mt-4">Page not found</h2>
          <p className="text-gray-600 mt-2 mb-8">
            Sorry, we couldn't find the page you're looking for.
          </p>
          <Link 
            to="/" 
            className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition duration-300"
          >
            Go back home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFound