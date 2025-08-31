import { useState } from "react";
import { FaEye, FaEyeSlash, FaShieldAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";

function Signup() {
  const { theme } = useAuth();
  const isDark = theme === "dark";
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [role, setRole] = useState("Citizen");
  const [password, setPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  const togglePasswordVisibility = (field) => {
    if (field === "password") setShowPassword(!showPassword);
    else setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!termsAccepted) {
      alert("You must accept the Terms and Privacy Policy.");
      return;
    }

    if (!role) {
      alert("Please select a role.");
      return;
    }

    const roleValue = role === "Citizen" ? "citizen" : "Authority";

    try {
      const response = await axios.post(
        "http://localhost:8383/citizen/create",
        {
          name,
          email,
          phoneNumber,
          role: roleValue,
          password,
        }
      );
      const { token } = response.data;
      localStorage.setItem("citizen_token", token);
      if (roleValue === "citizen") {
        navigate("/citizen-dashboard");
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert(
        error.response?.data?.message ||
          "Signup failed. Please try again later."
      );
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
            Create Account
          </h2>
          <p
            className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}
          >
            Join BillboardWatch to start reporting violations and help keep your
            city compliant
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className={`block text-sm font-medium ${
                isDark ? "text-[#F6F6F6]" : "text-[#0A0A0A]"
              }`}
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors duration-300
                ${
                  isDark
                    ? "bg-[#1A1A1A] border-gray-600 text-[#F6F6F6] focus:ring-[#F6F6F6]/50"
                    : "bg-gray-100 border-gray-300 text-[#0A0A0A] focus:ring-gray-400/50"
                }`}
              required
            />
          </div>

          {/* Email */}
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
              className={`mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors duration-300
                ${
                  isDark
                    ? "bg-[#1A1A1A] border-gray-600 text-[#F6F6F6] focus:ring-[#F6F6F6]/50"
                    : "bg-gray-100 border-gray-300 text-[#0A0A0A] focus:ring-gray-400/50"
                }`}
              required
            />
          </div>

          {/* Phone Number */}
          <div>
            <label
              htmlFor="phoneNumber"
              className={`block text-sm font-medium ${
                isDark ? "text-[#F6F6F6]" : "text-[#0A0A0A]"
              }`}
            >
              Phone Number
            </label>
            <input
              type="tel"
              id="phoneNumber"
              placeholder="Enter your phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className={`mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors duration-300
                ${
                  isDark
                    ? "bg-[#1A1A1A] border-gray-600 text-[#F6F6F6] focus:ring-[#F6F6F6]/50"
                    : "bg-gray-100 border-gray-300 text-[#0A0A0A] focus:ring-gray-400/50"
                }`}
              required
            />
          </div>

          {/* Role */}
          <div>
            <label
              htmlFor="role"
              className={`block text-sm font-medium ${
                isDark ? "text-[#F6F6F6]" : "text-[#0A0A0A]"
              }`}
            >
              Role
            </label>
            <input
              type="text"
              disabled={true}
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md pr-10 transition-colors duration-300
                ${
                  isDark
                    ? "bg-[#1A1A1A] border-gray-600 text-[#F6F6F6]"
                    : "bg-gray-100 border-gray-300 text-[#0A0A0A]"
                }`}
            />
          </div>

          {/* Password */}
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
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md pr-10 transition-colors duration-300
                  ${
                    isDark
                      ? "bg-[#1A1A1A] border-gray-600 text-[#F6F6F6]"
                      : "bg-gray-100 border-gray-300 text-[#0A0A0A]"
                  }`}
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("password")}
                className={`absolute inset-y-0 right-0 flex items-center pr-3 ${
                  isDark
                    ? "text-[#F6F6F6] hover:text-gray-300"
                    : "text-[#0A0A0A] hover:text-gray-600"
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

          {/* Terms */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="terms"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className={`h-4 w-4 rounded focus:ring-2 transition-colors duration-300
                ${
                  isDark
                    ? "text-[#F6F6F6] bg-[#1A1A1A] border-gray-600 focus:ring-[#F6F6F6]/50"
                    : "text-[#0A0A0A] bg-gray-100 border-gray-300 focus:ring-gray-400/50"
                }`}
              required
            />
            <label
              htmlFor="terms"
              className={`ml-2 text-sm ${
                isDark ? "text-[#F6F6F6]" : "text-[#0A0A0A]"
              }`}
            >
              I agree to the Terms of Service and Privacy Policy
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className={`w-full py-2 rounded-md font-semibold transition-colors duration-300
              ${
                isDark
                  ? "bg-[#F6F6F6] text-[#0A0A0A] hover:bg-[#E6E6E6]"
                  : "bg-[#0A0A0A] text-[#F6F6F6] hover:bg-[#333333]"
              }`}
          >
            Create Account
          </button>
        </form>

        <div
          className={`mt-4 text-center text-sm ${
            isDark ? "text-[#F6F6F6]" : "text-[#0A0A0A]"
          }`}
        >
          <p>
            Already have an account?{" "}
            <a
              href="/login/citizen"
              className={`hover:underline ${
                isDark ? "text-[#F6F6F6]" : "text-[#0A0A0A]"
              }`}
            >
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
