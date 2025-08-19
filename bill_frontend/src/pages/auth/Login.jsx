import { useState } from "react";
import { FaEye, FaEyeSlash, FaShieldAlt, FaUserTie } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuthorityLogin } from "../../hooks/Authority/Authentication";
import { CitizenLogin } from "../../hooks/Citizen/Authentication";
import { useAuth } from "../../middleware/AuthController";
import { UseRollBased } from "../../middleware/RollBasedAccessController";

function Login() {
  const { login } = useAuth();
  const { type } = UseRollBased(); // 👈 type comes from middleware (citizen/authority)
  const navigate = useNavigate();

  // Hooks
  const { loginUser, loading: citizenLoading, error: citizenError } = CitizenLogin();
  const { authorityLogin, loading: authorityLoading, error: authorityError } = useAuthorityLogin();

  // States
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let result;

    if (type === "citizen") {
      result = await loginUser({ email, password });
    } else if (type === "authority") {
      result = await authorityLogin({ email, password });
    }

    // ✅ Adjust condition for both cases
    if (
      (type === "citizen" && result?.success) ||
      (type === "authority" && result?.token)
    ) {
      login(type);
      navigate(type === "citizen" ? "/citizen-dashboard" : "/authority-dash");
    }
  };




  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4">
      <div className="bg-[#0A0A0A]/80 backdrop-blur-md border border-gray-700/50 rounded-lg p-6 w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-6">
          {type === "citizen" ? (
            <FaUserTie className="h-12 w-12 text-[#F6F6F6] mx-auto mb-4" />
          ) : (
            <FaShieldAlt className="h-12 w-12 text-[#F6F6F6] mx-auto mb-4" />
          )}
          <h2 className="text-2xl font-bold text-[#F6F6F6]">
            {type === "citizen" ? "Citizen Login" : "Authority Login"}
          </h2>
          <p className="text-sm text-[#F6F6F6]">
            {type === "citizen"
              ? "Sign in to report billboard violations as a citizen"
              : "Sign in to manage and verify reported billboard violations"}
          </p>
        </div>

        {/* Login Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#F6F6F6]">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder={type === "citizen" ? "Citizen email" : "Authority email"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full px-3 py-2 bg-[#1A1A1A] border border-gray-600 rounded-md text-[#F6F6F6] focus:outline-none focus:ring-2 focus:ring-[#F6F6F6]/50"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[#F6F6F6]">
              Password
            </label>
            <div className="relative mt-1">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-[#1A1A1A] border border-gray-600 rounded-md text-[#F6F6F6] focus:outline-none focus:ring-2 focus:ring-[#F6F6F6]/50 pr-10"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#F6F6F6] hover:text-gray-300"
              >
                {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Error Handling */}
          {(citizenError || authorityError) && (
            <p className="text-red-500 text-sm">{citizenError || authorityError}</p>
          )}

          {(citizenLoading || authorityLoading) && (
            <p className="text-gray-400 text-sm">Logging in...</p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={citizenLoading || authorityLoading}
            className="w-full py-2 bg-[#F6F6F6] text-[#0A0A0A] rounded-md font-semibold hover:bg-[#E6E6E6] transition-colors disabled:opacity-50"
          >
            {citizenLoading || authorityLoading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-4 text-center text-sm text-[#F6F6F6]">
          <p>
            Don&apos;t have an account?{" "}
            <a href="/signup" className="text-[#F6F6F6] hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
