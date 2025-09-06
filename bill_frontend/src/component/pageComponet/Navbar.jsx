import { Menu, Moon, Shield, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function NavBar() {
  const { authenticated, setAuthenticated, logout, theme, setTheme } =
    useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

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
        { name: "ReelReport", href: "/reelreport" },
        { name: "Leaderboard", href: "/leaderboard" },
      ]
    : [
        { name: "Home", href: "/" },
        { name: "About", href: "/about" },
      ];

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  useEffect(() => {
    if (theme === "dark") {
      document.body.style.backgroundColor = "#0A0A0A";
      document.body.style.color = "#FAFAFA";
    } else {
      document.body.style.backgroundColor = "#FAFAFA";
      document.body.style.color = "#0A0A0A";
    }
  }, [theme]);

  return (
    <nav
      className={`sticky top-0 z-50 w-full backdrop-blur-lg border-b shadow-md  ${
        theme === "dark"
          ? "bg-[#0A0A0A]/95 border-[#FAFAFA]/20"
          : "bg-[#FAFAFA]/95 border-[#0A0A0A]/20"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Shield
              className={`h-8 w-8 ${
                theme === "dark" ? "text-[#FAFAFA]" : "text-[#0A0A0A]"
              }`}
            />
            <span
              className={`font-bold text-xl ${
                theme === "dark" ? "text-[#FAFAFA]" : "text-[#0A0A0A]"
              }`}
            >
              BillboardWatch
            </span>
          </Link>
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-colors duration-200 border-b-2 border-transparent ${
                  location.pathname === item.href
                    ? theme === "dark"
                      ? "text-[#FAFAFA] border-[#FAFAFA]/60"
                      : "text-[#0A0A0A] border-[#0A0A0A]/60"
                    : theme === "dark"
                    ? "text-gray-400 hover:text-[#FAFAFA] hover:border-[#FAFAFA]/40"
                    : "text-gray-600 hover:text-[#0A0A0A] hover:border-[#0A0A0A]/40"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-colors duration-200 backdrop-blur-sm border ${
                theme === "dark"
                  ? "hover:bg-[#0A0A0A]/80 border-[#FAFAFA]/20"
                  : "hover:bg-[#FAFAFA]/80 border-[#0A0A0A]/20"
              }`}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5 text-gray-300" />
              ) : (
                <Moon className="h-5 w-5 text-gray-600" />
              )}
              <span className="sr-only">Toggle theme</span>
            </button>
            <div className="hidden md:flex items-center space-x-2">
              {authenticated ? (
                <>
                  <span
                    className={`text-sm font-medium ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
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
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 border ${
                      theme === "dark"
                        ? "text-gray-300 hover:text-[#FAFAFA] border-[#FAFAFA]/20 hover:bg-[#0A0A0A]/80"
                        : "text-gray-700 hover:text-[#0A0A0A] border-[#0A0A0A]/20 hover:bg-[#FAFAFA]/80"
                    }`}
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
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`md:hidden p-2 rounded-full transition-colors duration-200 backdrop-blur-sm border ${
                theme === "dark"
                  ? "hover:bg-[#0A0A0A]/80 border-[#FAFAFA]/20"
                  : "hover:bg-[#FAFAFA]/80 border-[#0A0A0A]/20"
              }`}
            >
              <Menu
                className={`h-5 w-5 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              />
              <span className="sr-only">Toggle menu</span>
            </button>
          </div>
        </div>
        <div
          className={`${
            isOpen ? "block" : "hidden"
          } md:hidden backdrop-blur-lg border-t transition-all duration-300 ease-in-out ${
            theme === "dark"
              ? "bg-[#0A0A0A]/95 border-[#FAFAFA]/20"
              : "bg-[#FAFAFA]/95 border-[#0A0A0A]/20"
          }`}
        >
          <div className="flex flex-col space-y-4 px-4 py-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsOpen(false)}
                className={`text-lg font-medium transition-colors duration-200 ${
                  location.pathname === item.href
                    ? theme === "dark"
                      ? "text-[#FAFAFA] border-l-4 border-[#FAFAFA]/60 pl-3"
                      : "text-[#0A0A0A] border-l-4 border-[#0A0A0A]/60 pl-3"
                    : theme === "dark"
                    ? "text-gray-300 hover:text-[#FAFAFA]"
                    : "text-gray-700 hover:text-[#0A0A0A]"
                }`}
              >
                {item.name}
              </Link>
            ))}
            <div
              className={`pt-4 border-t ${
                theme === "dark" ? "border-[#FAFAFA]/20" : "border-[#0A0A0A]/20"
              }`}
            >
              <div className="flex flex-col space-y-2">
                {authenticated ? (
                  <>
                    <span
                      className={`text-lg font-medium ${
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
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
                      className={`text-lg font-medium rounded-md px-4 py-2 transition-colors duration-200 border ${
                        theme === "dark"
                          ? "text-gray-300 hover:text-[#FAFAFA] border-[#FAFAFA]/20 hover:bg-[#0A0A0A]/80"
                          : "text-gray-700 hover:text-[#0A0A0A] border-[#0A0A0A]/20 hover:bg-[#FAFAFA]/80"
                      }`}
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
