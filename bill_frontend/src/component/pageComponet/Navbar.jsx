import Button from "../pageComponet/Button";
import { Menu, Moon, Shield, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function NavBar() {
  const { theme, setTheme } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const citizen_token = sessionStorage.getItem("citizen_token");
  const authority_token = sessionStorage.getItem("authority_token");

  const citizen_name = sessionStorage.getItem("citizen_name");
  const authority_name = sessionStorage.getItem("authority_name");

  const pic =
    sessionStorage.getItem("profile_pic") || "https://i.pravatar.cc/50";

  const authenticated = Boolean(citizen_token || authority_token);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  const navigation = authenticated
    ? [
        {
          name: "Dashboard",
          href: citizen_token ? "/citizen-dashboard" : "/authority-dashboard",
        },
        { name: "HeatMap", href: "/heatmap" },
        { name: "ReelReport", href: "/reelreport" },
      ]
    : [
        {
          name: "Home",
          href: "/",
        },
        { name: "About", href: "/about" },
      ];

  const toggleTheme = () =>
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));

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
      className={`sticky top-0 z-50 w-full backdrop-blur-lg border-b shadow-md ${
        theme === "dark"
          ? "bg-[#0A0A0A]/95 border-[#FAFAFA]/20"
          : "bg-[#FAFAFA]/95 border-[#0A0A0A]/20"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <NavLink to="/" className="flex items-center space-x-2">
            <Shield
              className={`h-8 w-8 ${theme === "dark" ? "text-[#FAFAFA]" : "text-[#0A0A0A]"}`}
            />
            <span
              className={`font-bold text-xl ${theme === "dark" ? "text-[#FAFAFA]" : "text-[#0A0A0A]"}`}
            >
              BillboardWatch
            </span>
          </NavLink>

          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <NavLink
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
              </NavLink>
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
            </button>

            {/* Authenticated User */}
            {authenticated ? (
              <div className="hidden md:flex items-center space-x-2">
                <img
                  src={pic}
                  alt="profile"
                  className="w-8 h-8 rounded-full cursor-pointer"
                  onClick={() => navigate("/profile")}
                />
                <span
                  onClick={() => navigate("/profile")}
                  className={`text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
                >
                  {citizen_name || authority_name || "User"}
                </span>
                <Button onClick={handleLogout} variant="outline">
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Button onClick={() => navigate("/login/citizen")}>
                  Citizen
                </Button>
                <Button onClick={() => navigate("/login/authority")}>
                  Authority
                </Button>
              </div>
            )}

            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`md:hidden p-2 rounded-full transition-colors duration-200 backdrop-blur-sm border ${
                theme === "dark"
                  ? "hover:bg-[#0A0A0A]/80 border-[#FAFAFA]/20"
                  : "hover:bg-[#FAFAFA]/80 border-[#0A0A0A]/20"
              }`}
            >
              <Menu
                className={`h-5 w-5 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
              />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div
            className={`md:hidden backdrop-blur-lg border-t ${
              theme === "dark"
                ? "bg-[#0A0A0A]/95 border-[#FAFAFA]/20"
                : "bg-[#FAFAFA]/95 border-[#0A0A0A]/20"
            }`}
          >
            <div className="flex flex-col space-y-4 px-4 py-6">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`text-lg font-medium transition-colors duration-200 ${
                    theme === "dark"
                      ? "text-gray-300 hover:text-[#FAFAFA]"
                      : "text-gray-700 hover:text-[#0A0A0A]"
                  }`}
                >
                  {item.name}
                </NavLink>
              ))}

              {authenticated ? (
                <div className="flex flex-col space-y-3">
                  <img
                    src={pic}
                    alt="profile"
                    className="w-10 h-10 rounded-full"
                  />
                  <span
                    className={`text-lg font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
                  >
                    {citizen_name || authority_name}
                  </span>

                  <Button onClick={handleLogout} variant="outline">
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex space-x-3">
                  <Button onClick={() => navigate("/login/citizen")}>
                    Citizen
                  </Button>
                  <Button onClick={() => navigate("/login/authority")}>
                    Authority
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
