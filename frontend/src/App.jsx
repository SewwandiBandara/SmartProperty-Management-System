import { BrowserRouter,Routes,Route} from "react-router-dom";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Features from "./pages/Features";
import Pricing from "./pages/Pricing";
import Contact from "./pages/Contact";
import About from "./pages/About";
import HelpCenter from "./pages/HelpCenter";
import Blog from "./pages/Blog";
import Careers from "./pages/Careers";
import ManagerDashboard from "./pages/dashboards/ManagerDashboard";
import CustomerDashboard from "./pages/dashboards/CustomerDashboard";
import PropertyManagement from "./pages/PropertyManagement";
import PaymentSystem from "./pages/PaymentSystem";
import MaintenanceRequests from "./pages/MaintenanceRequests";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";



function App() {

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<Home/>} path="/"/>

          {/* Public pages */}
          <Route element={<Register/>} path="/register"/>
          <Route element={<Login/>} path="/login"/>
          <Route element={<Features/>} path="/features"/>
          <Route element={<Pricing/>} path="/pricing"/>
          <Route element={<Contact/>} path="/contact"/>
          <Route element={<About/>} path="/about"/>
          <Route element={<HelpCenter/>} path="/help"/>
          <Route element={<Blog/>} path="/blog"/>
          <Route element={<Careers/>} path="/careers"/>

          {/* Protected Dashboard Routes - Role-based */}
          <Route
            path="/dashboard/customer"
            element={
              <ProtectedRoute allowedUserTypes={['customer']}>
                <CustomerDashboard/>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/manager"
            element={
              <ProtectedRoute allowedUserTypes={['manager']}>
                <ManagerDashboard/>
              </ProtectedRoute>
            }
          />

          {/* Other protected pages */}
          <Route
            path="/property"
            element={
              <ProtectedRoute>
                <PropertyManagement/>
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment"
            element={
              <ProtectedRoute>
                <PaymentSystem/>
              </ProtectedRoute>
            }
          />
          <Route
            path="/maintenance"
            element={
              <ProtectedRoute>
                <MaintenanceRequests/>
              </ProtectedRoute>
            }
          />

          {/* Default route for 404 Not Found */}
          <Route element={<NotFound/>} path="*"/>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
