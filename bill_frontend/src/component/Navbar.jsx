import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <nav className="bg-[#0A0A0A] shadow-md fixed w-full top-0 left-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-[#FAFAFA]">
          City Compliance
        </Link>
        <div className="space-x-6">
          <Link to="/heatmap" className="hover:text-gray-300 text-[#FAFAFA]">
            Public Map
          </Link>
          <Link to="/about" className="hover:text-gray-300 text-[#FAFAFA]">
            About
          </Link>
          <Link to="/signup" className="hover:text-gray-300 text-[#FAFAFA]">
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
