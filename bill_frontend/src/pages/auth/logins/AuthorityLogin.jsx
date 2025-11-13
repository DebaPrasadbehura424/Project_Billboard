import { useState } from "react";
import { FaEye, FaEyeSlash, FaShieldAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";

function AuthorityLogin() {
  const navigate = useNavigate();
  const { theme } = useAuth();
  const isDark = theme === "dark";

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8383/authority/login",
        {
          email,
          password,
        }
      );

      const { token } = response.data;
      localStorage.setItem("authority_token", token);
      navigate("/authority-dashboard");
    } catch (err) {
      console.error("Login failed:", err.response?.data?.error || err.message);
      alert("Login failed. Please check your email or password.");
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${
        isDark ? "bg-[#0A0A0A]" : "bg-gray-100"
      }`}
    >
      <div
        className={`backdrop-blur-md border rounded-lg p-6 w-full max-w-md transition-colors duration-300 ${
          isDark
            ? "bg-[#0A0A0A]/80 border-gray-700/50"
            : "bg-white border-gray-300"
        }`}
      >
        <div className="text-center mb-6">
          <FaShieldAlt
            className={`h-12 w-12 mx-auto mb-4 ${
              isDark ? "text-[#F6F6F6]" : "text-gray-800"
            }`}
          />
          <h2
            className={`text-2xl font-bold ${
              isDark ? "text-[#F6F6F6]" : "text-gray-900"
            }`}
          >
            Authority Login
          </h2>
          <p
            className={`text-sm ${isDark ? "text-[#F6F6F6]" : "text-gray-600"}`}
          >
            Sign in to your Authority account
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className={`block text-sm font-medium ${
                isDark ? "text-[#F6F6F6]" : "text-gray-700"
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
              className={`mt-1 w-full px-3 py-2 border rounded-md transition-colors duration-300 ${
                isDark
                  ? "bg-[#1A1A1A] border-gray-600 text-[#F6F6F6]"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className={`block text-sm font-medium ${
                isDark ? "text-[#F6F6F6]" : "text-gray-700"
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
                className={`w-full px-3 py-2 border rounded-md pr-10 transition-colors duration-300 ${
                  isDark
                    ? "bg-[#1A1A1A] border-gray-600 text-[#F6F6F6]"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className={`absolute inset-y-0 right-0 flex items-center pr-3 ${
                  isDark ? "text-[#F6F6F6]" : "text-gray-600"
                }`}
              >
                {showPassword ? (
                  <FaEyeSlash className="h-5 w-5" />
                ) : (
                  <FaEye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className={`w-full py-2 rounded-md font-semibold transition-colors duration-300 ${
              isDark
                ? "bg-[#F6F6F6] text-[#0A0A0A] hover:bg-[#E6E6E6]"
                : "bg-gray-900 text-white hover:bg-gray-700"
            }`}
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

export default AuthorityLogin;
