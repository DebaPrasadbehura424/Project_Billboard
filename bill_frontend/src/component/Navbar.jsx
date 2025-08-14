import { Link } from "react-router-dom";
const NavBar = () => {
  return (
    <nav className="bg-white shadow-md fixed w-full top-0 left-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-blue-600">
          City Compliance
        </Link>
        <div className="space-x-6">
          <Link to="/heatmap" className="hover:text-blue-600">
            Public Map
          </Link>
          <Link to="/about" className="hover:text-blue-600">
            About
          </Link>
          <Link to="/signup" className="hover:text-blue-600">
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
};
