import { useState } from "react";
import { FaEye, FaEyeSlash, FaShieldAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

function CitizenLogin() {
  const { theme } = useAuth();
  const isDark = theme === "dark";

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8383/citizen/login", {
        email,
        password,
      });

      const { token } = response.data;

      sessionStorage.setItem("citizen_token", token);

      navigate("/citizen-dashboard");
    } catch (err) {
      console.error("Login failed:", err.response?.data?.error || err.message);
      alert("Login failed. Please check your email or password.");
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300
        ${isDark ? "bg-[#0A0A0A]" : "bg-[#FAFAFA]"}`}
    >
      <div
        className={`backdrop-blur-md rounded-lg p-6 w-full max-w-md border transition-colors duration-300
        ${
          isDark
            ? "bg-[#0A0A0A]/80 border-gray-700/50"
            : "bg-white border-gray-300"
        }`}
      >
        <div className="text-center mb-6">
          <FaShieldAlt
            className={`h-12 w-12 mx-auto mb-4 ${
              isDark ? "text-[#F6F6F6]" : "text-[#0A0A0A]"
            }`}
          />
          <h2
            className={`text-2xl font-bold ${
              isDark ? "text-[#F6F6F6]" : "text-[#0A0A0A]"
            }`}
          >
            Citizen Login
          </h2>
          <p
            className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}
          >
            Sign in to your Citizen account
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className={`block text-sm font-medium ${
                isDark ? "text-[#F6F6F6]" : "text-[#0A0A0A]"
              }`}
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`mt-1 w-full px-3 py-2 border rounded-md transition-colors duration-300
                ${
                  isDark
                    ? "bg-[#1A1A1A] border-gray-600 text-[#F6F6F6]"
                    : "bg-gray-100 border-gray-300 text-[#0A0A0A]"
                }`}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className={`block text-sm font-medium ${
                isDark ? "text-[#F6F6F6]" : "text-[#0A0A0A]"
              }`}
            >
              Password
            </label>
            <div className="relative mt-1">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md pr-10 transition-colors duration-300
                  ${
                    isDark
                      ? "bg-[#1A1A1A] border-gray-600 text-[#F6F6F6]"
                      : "bg-gray-100 border-gray-300 text-[#0A0A0A]"
                  }`}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className={`absolute inset-y-0 right-0 flex items-center pr-3
                  ${isDark ? "text-[#F6F6F6]" : "text-[#0A0A0A]"}`}
              >
                {showPassword ? (
                  <FaEyeSlash className="h-5 w-5" />
                ) : (
                  <FaEye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className={`w-full py-2 rounded-md font-semibold transition-colors duration-300
              ${
                isDark
                  ? "bg-[#F6F6F6] text-[#0A0A0A] hover:bg-[#E6E6E6]"
                  : "bg-[#0A0A0A] text-[#F6F6F6] hover:bg-[#333333]"
              }`}
          >
            Sign In
          </button>
        </form>

        <div
          className={`mt-4 text-center text-sm ${
            isDark ? "text-[#F6F6F6]" : "text-[#0A0A0A]"
          }`}
        >
          <p>
            Don't have an account?{" "}
            <a
              href="/signup/citizen"
              className={`hover:underline ${
                isDark ? "text-[#F6F6F6]" : "text-[#0A0A0A]"
              }`}
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default CitizenLogin;
