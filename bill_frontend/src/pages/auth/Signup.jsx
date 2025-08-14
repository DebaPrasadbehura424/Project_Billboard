import { FaShieldAlt, FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";

function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = (field) => {
    if (field === "password") setShowPassword(!showPassword);
    else setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4">
      <div className="bg-[#0A0A0A]/80 backdrop-blur-md border border-gray-700/50 rounded-lg p-6 w-full max-w-md">
        <div className="text-center mb-6">
          <FaShieldAlt className="h-12 w-12 text-[#F6F6F6] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#F6F6F6]">Create Account</h2>
          <p className="text-sm text-[#F6F6F6]">
            Join BillboardWatch to start reporting violations and help keep your
            city compliant
          </p>
        </div>

        <form className="space-y-4">
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-[#F6F6F6]"
            >
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              placeholder="Enter your full name"
              className="mt-1 w-full px-3 py-2 bg-[#1A1A1A] border border-gray-600 rounded-md text-[#F6F6F6] focus:outline-none focus:ring-2 focus:ring-[#F6F6F6]/50"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[#F6F6F6]"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              className="mt-1 w-full px-3 py-2 bg-[#1A1A1A] border border-gray-600 rounded-md text-[#F6F6F6] focus:outline-none focus:ring-2 focus:ring-[#F6F6F6]/50"
            />
          </div>

          <div>
            <label
              htmlFor="accountType"
              className="block text-sm font-medium text-[#F6F6F6]"
            >
              Account Type
            </label>
            <select
              id="accountType"
              className="mt-1 w-full px-3 py-2 bg-[#1A1A1A] border border-gray-600 rounded-md text-[#F6F6F6] focus:outline-none focus:ring-2 focus:ring-[#F6F6F6]/50"
            >
              <option>Select your account type</option>
              <option>Citizen</option>
              <option>Authority</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-[#F6F6F6]"
            >
              Password
            </label>
            <div className="relative mt-1">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Create a password"
                className="w-full px-3 py-2 bg-[#1A1A1A] border border-gray-600 rounded-md text-[#F6F6F6] focus:outline-none focus:ring-2 focus:ring-[#F6F6F6]/50 pr-10"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("password")}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#F6F6F6] hover:text-gray-300"
              >
                {showPassword ? (
                  <FaEyeSlash className="h-5 w-5" />
                ) : (
                  <FaEye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-[#F6F6F6]"
            >
              Confirm Password
            </label>
            <div className="relative mt-1">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                placeholder="Confirm your password"
                className="w-full px-3 py-2 bg-[#1A1A1A] border border-gray-600 rounded-md text-[#F6F6F6] focus:outline-none focus:ring-2 focus:ring-[#F6F6F6]/50 pr-10"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("confirm")}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#F6F6F6] hover:text-gray-300"
              >
                {showConfirmPassword ? (
                  <FaEyeSlash className="h-5 w-5" />
                ) : (
                  <FaEye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="terms"
              className="h-4 w-4 text-[#F6F6F6] bg-[#1A1A1A] border-gray-600 rounded focus:ring-[#F6F6F6]/50"
            />
            <label htmlFor="terms" className="ml-2 text-sm text-[#F6F6F6]">
              I agree to the Terms of Service and Privacy Policy
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-[#F6F6F6] text-[#0A0A0A] rounded-md font-semibold hover:bg-[#E6E6E6] transition-colors"
          >
            Create Account
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-[#F6F6F6]">
          <p>
            Already have an account?{" "}
            <a href="/login" className="text-[#F6F6F6] hover:underline">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
