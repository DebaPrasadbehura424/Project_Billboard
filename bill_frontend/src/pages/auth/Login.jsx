import { useState } from "react";
import { FaEye, FaEyeSlash, FaShieldAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../middleware/AuthController";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:2000/api/auth/userAuth-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      // store token + user in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("isauth", "true");

      // update auth context
      login();

      // navigate based on user_type
      if (data.user.user_type === "citizen") {
        navigate("/citizen-dashboard");
      } else {
        navigate("/admin-dashboard");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4">
      <div className="bg-[#0A0A0A]/80 backdrop-blur-md border border-gray-700/50 rounded-lg p-6 w-full max-w-md">
        <div className="text-center mb-6">
          <FaShieldAlt className="h-12 w-12 text-[#F6F6F6] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#F6F6F6]">Welcome Back</h2>
          <p className="text-sm text-[#F6F6F6]">
            Sign in to your BillboardWatch account to continue reporting violations
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#F6F6F6]">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full px-3 py-2 bg-[#1A1A1A] border border-gray-600 rounded-md text-[#F6F6F6] focus:outline-none focus:ring-2 focus:ring-[#F6F6F6]/50"
            />
          </div>

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

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full py-2 bg-[#F6F6F6] text-[#0A0A0A] rounded-md font-semibold hover:bg-[#E6E6E6] transition-colors"
          >
            Sign In
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-[#F6F6F6]">
          <p>
            Don't have an account?{" "}
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
