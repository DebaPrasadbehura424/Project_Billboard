import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Footer from "../component/Footer";
import NavBar from "../component/Navbar";
import About from "../pages/About";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import CitizenDashboard from "../pages/DashBoard/CitizenDashboard";
import Home from "../pages/Home";

function Navigation() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/citizen-dashboard" element={<CitizenDashboard />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default Navigation;
