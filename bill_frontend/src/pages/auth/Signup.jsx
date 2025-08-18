import { useState } from "react";
import { FaShieldAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { CitizenSignup } from "../../hooks/Citizen/Authentication";

function Signup() {
  const navigate = useNavigate();
  const { signup, loading } = CitizenSignup(); // ✅ use hook

  // States for form data
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [accountType, setAccountType] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!termsAccepted) {
      alert("You must accept the Terms and Privacy Policy.");
      return;
    }

    const { ok, data } = await signup({
      name: fullName,
      email,
      password,
      number: phoneNumber,
      userType: accountType,
    });

    if (ok) {
      alert("Account created successfully!");
      navigate("/login");
    } else {
      alert(data.message || "Something went wrong!");
    }
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

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-[#F6F6F6]">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1 w-full px-3 py-2 bg-[#1A1A1A] border border-gray-600 rounded-md text-[#F6F6F6] focus:outline-none focus:ring-2 focus:ring-[#F6F6F6]/50"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-[#F6F6F6]">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full px-3 py-2 bg-[#1A1A1A] border border-gray-600 rounded-md text-[#F6F6F6] focus:outline-none focus:ring-2 focus:ring-[#F6F6F6]/50"
              required
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-[#F6F6F6]">
              Phone Number
            </label>
            <input
              type="tel"
              placeholder="Enter your phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="mt-1 w-full px-3 py-2 bg-[#1A1A1A] border border-gray-600 rounded-md text-[#F6F6F6] focus:outline-none focus:ring-2 focus:ring-[#F6F6F6]/50"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-[#F6F6F6]">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full px-3 py-2 bg-[#1A1A1A] border border-gray-600 rounded-md text-[#F6F6F6] focus:outline-none focus:ring-2 focus:ring-[#F6F6F6]/50"
              required
            />
          </div>

          {/* Account Type */}
          <div>
            <label className="block text-sm font-medium text-[#F6F6F6]">
              Account Type
            </label>
            <select
              value={accountType}
              onChange={(e) => setAccountType(e.target.value)}
              className="mt-1 w-full px-3 py-2 bg-[#1A1A1A] border border-gray-600 rounded-md text-[#F6F6F6] focus:outline-none focus:ring-2 focus:ring-[#F6F6F6]/50"
              required
            >
              <option value="">Select your account type</option>
              <option value="Citizen">Citizen</option>
              <option value="Authority">Authority</option>
            </select>
          </div>

          {/* Terms */}
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="h-4 w-4 text-[#F6F6F6] bg-[#1A1A1A] border-gray-600 rounded focus:ring-[#F6F6F6]/50"
              required
            />
            <label className="ml-2 text-sm text-[#F6F6F6]">
              I agree to the Terms of Service and Privacy Policy
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-[#F6F6F6] text-[#0A0A0A] rounded-md font-semibold hover:bg-[#E6E6E6] transition-colors"
          >
            {loading ? "Creating..." : "Create Account"}
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
