import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import NavBar from "../component/Navbar";
import Home from "../pages/Home";
import About from "../pages/About";
import Footer from "../component/Footer";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";

function Navigation() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default Navigation;
