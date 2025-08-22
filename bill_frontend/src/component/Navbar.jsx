import { Menu, Moon, Shield, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function NavBar() {
  const { authenticated, setAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState("light");

  const citizen_name = sessionStorage.getItem("citizen_name");
  const authority_name = sessionStorage.getItem("authority_name");
  const citizen_token = localStorage.getItem("citizen_token");

  function navigateToHome() {
    setAuthenticated(false);
    navigate("/");
  }
  const handleLogout = () => {
    logout();
    setTimeout(() => {
      navigateToHome();
    }, 0);
  };

  const navigation = authenticated
    ? [
        {
          name: "Dashboard",
          href: citizen_token ? "/citizen-dashboard" : "/authority-dashboard",
        },
        { name: "HeatMap", href: "/heatmap" },
      ]
    : [
        { name: "Home", href: "/" },
        { name: "About", href: "/about" },
      ];

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
    document.documentElement.classList.toggle("dark");
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#0A0A0A]/95 backdrop-blur-lg border-b border-[#FAFAFA]/20 shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-[#FAFAFA]" />
            <span className="font-bold text-xl text-[#FAFAFA]">
              BillboardWatch
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-colors duration-200 hover:text-[#FAFAFA] border-b-2 border-transparent hover:border-[#FAFAFA]/40 ${
                  location.pathname === item.href
                    ? "text-[#FAFAFA] border-[#FAFAFA]/60"
                    : "text-gray-400"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right side buttons */}
          <div className="flex items-center space-x-4">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-[#0A0A0A]/80 transition-colors duration-200 backdrop-blur-sm border border-[#FAFAFA]/20"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5 text-gray-300" />
              ) : (
                <Moon className="h-5 w-5 text-gray-300" />
              )}
              <span className="sr-only">Toggle theme</span>
            </button>

            {/* Auth buttons - desktop */}
            <div className="hidden md:flex items-center space-x-2">
              {authenticated ? (
                <>
                  <span className="text-sm font-medium text-gray-300">
                    {citizen_name || authority_name}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors duration-200 border border-red-600/50"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login/citizen"
                    className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-[#FAFAFA] transition-colors duration-200 border border-[#FAFAFA]/20 rounded-md hover:bg-[#0A0A0A]/80"
                  >
                    Citizen
                  </Link>
                  <Link
                    to="/login/authority"
                    className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-md transition-colors duration-200 border border-purple-600/50"
                  >
                    Authority
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-full hover:bg-[#0A0A0A]/80 transition-colors duration-200 backdrop-blur-sm border border-[#FAFAFA]/20"
            >
              <Menu className="h-5 w-5 text-gray-300" />
              <span className="sr-only">Toggle menu</span>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`${
            isOpen ? "block" : "hidden"
          } md:hidden bg-[#0A0A0A]/95 backdrop-blur-lg border-t border-[#FAFAFA]/20 transition-all duration-300 ease-in-out`}
        >
          <div className="flex flex-col space-y-4 px-4 py-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsOpen(false)}
                className={`text-lg font-medium transition-colors duration-200 hover:text-[#FAFAFA] ${
                  location.pathname === item.href
                    ? "text-[#FAFAFA] border-l-4 border-[#FAFAFA]/60 pl-3"
                    : "text-gray-300"
                }`}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-[#FAFAFA]/20">
              <div className="flex flex-col space-y-2">
                {authenticated ? (
                  <>
                    <span className="text-lg font-medium text-gray-300">
                      {citizen_name || authority_name || "User"}
                    </span>
                    <button
                      onClick={() => {
                        handleLogout();
                      }}
                      className="text-lg font-medium text-white bg-red-600 hover:bg-red-700 rounded-md px-4 py-2 transition-colors duration-200 border border-red-600/50"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login/citizen"
                      onClick={() => setIsOpen(false)}
                      className="text-lg font-medium text-gray-300 hover:text-[#FAFAFA] transition-colors duration-200 border border-[#FAFAFA]/20 rounded-md px-4 py-2 hover:bg-[#0A0A0A]/80"
                    >
                      Citizen
                    </Link>
                    <Link
                      to="/login/authority"
                      onClick={() => setIsOpen(false)}
                      className="text-lg font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-md px-4 py-2 transition-colors duration-200 border border-purple-600/50"
                    >
                      Authority
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
