import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ProtectedRoute = ({ children, allowedUserTypes }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (allowedUserTypes && !allowedUserTypes.includes(user.userType)) {
    // Redirect to their own dashboard if they try to access wrong dashboard
    const userDashboards = {
      manager: '/dashboard/manager',
      customer: '/dashboard/customer'
    }
    return <Navigate to={userDashboards[user.userType] || '/login'} replace />
  }

  return children
}

export default ProtectedRoute
