import { BrowserRouter,Routes,Route} from "react-router-dom";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Features from "./pages/Features";
import Pricing from "./pages/Pricing";
import Contact from "./pages/Contact";
import About from "./pages/About";

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
    </Routes>
    </BrowserRouter>
  )
}

export default App
