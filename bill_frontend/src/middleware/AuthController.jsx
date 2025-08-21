import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = localStorage.getItem("isauth");
    setAuthenticated(checkAuth === "true");
  }, []);

  // login
  const login = () => {
    localStorage.setItem("isauth", "true");
    setAuthenticated(true);
  };

  // logout
  const logout = () => {
    localStorage.removeItem("isauth");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("authorityToken");

    setAuthenticated(false);
    window.location.href = "/"; // redirect after logout
  };

  return (
    <AuthContext.Provider value={{ authenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within the AuthProvider");
  }
  return context;
};
