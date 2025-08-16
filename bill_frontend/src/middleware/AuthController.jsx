import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const citizen_token = localStorage.getItem("citizen_token");
    setAuthenticated(!!citizen_token); // true if token exists
  }, []);

  const login = () => {
    const citizen_token = localStorage.getItem("citizen_token");
    if (citizen_token) {
      setAuthenticated(true);
    }
  };

  const logout = () => {
    localStorage.removeItem("citizen_token");
    setAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ authenticated, login, logout, setAuthenticated }}
    >
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
