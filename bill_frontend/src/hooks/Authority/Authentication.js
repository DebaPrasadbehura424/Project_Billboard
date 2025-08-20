import { useState } from "react";

export const useAuthorityRegister = () => {
  const [loading, setLoading] = useState(false);

  const signupAuthority = async ({ name, email, number, password }) => {
    try {
      setLoading(true);

      const res = await fetch("http://localhost:2000/api/authority-register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, number, password }),
      });

      const data = await res.json();
      return { ok: res.ok, data };
    } catch (err) {
      return { ok: false, data: { message: "Network error" } };
    } finally {
      setLoading(false);
    }
  };

  return { signupAuthority, loading };
};


export const useAuthorityLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  const authorityLogin = async ({ email, password }) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:2000/api/authority-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      
      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Save token to localStorage
      localStorage.setItem("authorityToken", data.token);

      setUser(data.data); // user info from backend
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { authorityLogin, loading, error, user };
};

