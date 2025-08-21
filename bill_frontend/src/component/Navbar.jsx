import { Menu, Moon, Shield, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useGetAuthorityInfo } from "../hooks/Authority/GetAuthorityInfo";
import { useGetCitizenInfo } from "../hooks/Citizen/CitizenInfo";
import { useAuth } from "../middleware/AuthController";
import { UseRollBased } from "../middleware/RollBasedAccessController";

export default function NavBar() {
  const { type } = UseRollBased(); // "citizen" | "authority"
  const { authenticated, logout } = useAuth();

  // ✅ hooks
  const {
    getTheData: getAuthorityData,
    authority,
    loading: authorityLoading,
  } = useGetAuthorityInfo();

  const {
    getCitizenData,
    citizen,
    loading: citizenLoading,
  } = useGetCitizenInfo();

  const navigation = authenticated
    ? type === "citizen"
      ? [
          { name: "DashBoard", href: "/citizen-dashboard" },
          { name: "HeatMap", href: "/heatmap" },
        ]
      : [
          { name: "Authority Dashboard", href: "/authority-dash" },
          { name: "Reports", href: "/reports" },
        ]
    : [
        { name: "Home", href: "/" },
        { name: "About", href: "/about" },
      ];

  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
    document.documentElement.classList.toggle("dark");
  };

  // ✅ fetch user info based on role
  useEffect(() => {
    if (!authenticated) return;

    if (type === "citizen") {
      getCitizenData();
    } else if (type === "authority") {
      getAuthorityData();
    }
  }, [authenticated, type]);

  // ✅ decide what to display
  const displayUser =
    type === "authority"
      ? authorityLoading
        ? "Loading Authority..."
        : authority?.email || authority?.email || "Authority"
      : citizenLoading
      ? "Loading Citizen..."
      : citizen?.name || citizen?.email || "Citizen";

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

            {/* Auth buttons */}
            <div className="hidden md:flex items-center space-x-2">
              {authenticated ? (
                <>
                  <span className="text-sm font-medium text-gray-300">
                    {displayUser}
                  </span>
                  <button
                    onClick={logout}
                    className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-[#FAFAFA] transition-colors duration-200 border border-[#FAFAFA]/20 rounded-md hover:bg-[#0A0A0A]/80"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-[#FAFAFA] transition-colors duration-200 border border-[#FAFAFA]/20 rounded-md hover:bg-[#0A0A0A]/80"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors duration-200 border border-blue-600/50"
                  >
                    Sign Up
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
      </div>
    </nav>
  );
}
