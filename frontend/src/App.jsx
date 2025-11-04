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
import AdminDashboard from "./pages/AdminDashboard";
import LandlordDashboard from "./pages/LandlordDashboard";
import TenantDashboard from "./pages/TenantDashboard";
import PropertyManagement from "./pages/PropertyManagement";
import PaymentSystem from "./pages/PaymentSystem";
import MaintenanceRequests from "./pages/MaintenanceRequests";


function App() {
  
  return (
    <BrowserRouter>
    <Routes>
        <Route element={<Home/>} path="/"/>
         {/* Default route for 404 Not Found */}
        <Route element={<NotFound/>} path="*"/> 
        {/* pages */}
        <Route element={<Register/>} path="/register"/>
        <Route element={<Login/>} path="/login"/>
        <Route element={<Features/>} path="/features"/>
        <Route element={<Pricing/>} path="/pricing"/>
        <Route element={<Contact/>} path="/contact"/>
        <Route element={<About/>} path="/about"/>
        <Route element={<HelpCenter/>} path="/help"/>
        <Route element={<Blog/>} path="/blog"/>
        <Route element={<Careers/>} path="/careers"/>
        <Route element={<AdminDashboard/>} path="admin"/>
        <Route element={<LandlordDashboard/>} path="landlord"/>
        <Route element={<TenantDashboard/>} path="tenant"/>
        <Route element={<PropertyManagement/>} path="/property"/>
        <Route element={<PaymentSystem/>} path="/payment"/>
        <Route element={<MaintenanceRequests/>} path="/maintenance"/>
    </Routes>
    </BrowserRouter>
  )
}

export default App
