// Get the appropriate dashboard route based on user type
export const getDashboardRoute = (userType) => {
  const routes = {
    landlord: '/dashboard/landlord',
    tenant: '/dashboard/tenant',
    agent: '/dashboard/agent',
    manager: '/admin'
  }

  return routes[userType] || '/dashboard/landlord'
}

export default getDashboardRoute
