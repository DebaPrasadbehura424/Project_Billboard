// src/hooks/useAuth.js
import { useState } from "react";

const API_BASE = "http://localhost:2000/api/auth";

export function CitizenSignup() {
  const [loading, setLoading] = useState(false);

  // ✅ Signup function
  const signup = async ({ name, email, password, number, userType }) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/userAuth-register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, number, userType }),
      });

      const data = await response.json();
      return { ok: response.ok, data };
    } catch (err) {
      console.error("❌ Signup Error:", err);
      return { ok: false, data: { message: "Server error, please try again." } };
    } finally {
      setLoading(false);
    }
  };

  return { signup, loading };
}



export const CitizenLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loginUser = async ({ email, password }) => {
    setLoading(true);
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
        throw new Error(data.message || "Login failed");
      }

      // ✅ store in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("isauth", "true");

      return { success: true, user: data.user };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return { loginUser, loading, error };
};
