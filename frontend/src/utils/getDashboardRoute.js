// Get the appropriate dashboard route based on user type
export const getDashboardRoute = (userType) => {
  const routes = {
    customer: '/dashboard/customer',
    manager: '/dashboard/manager'
  }

  return routes[userType] || '/dashboard/customer'
}

export default getDashboardRoute
