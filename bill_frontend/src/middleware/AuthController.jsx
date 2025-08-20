import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [totalReports, setTotalReports] = useState(0);
  const [pendingReports, setPendingReports] = useState(0);
  const [approvedReports, setApprovedReports] = useState(0);
  const [rejectedReports, setRejectedReports] = useState(0);
  const [reports, setReports] = useState([]);
  const [theme, setTheme] = useState(true);

  useEffect(() => {
    const citizen_token = localStorage.getItem("citizen_token");
    setAuthenticated(!!citizen_token);
  }, []);

  const login = () => {
    const citizen_token = localStorage.getItem("citizen_token");
    const authority_token = localStorage.getItem("authority_token");
    if (citizen_token) {
      setAuthenticated(true);
    }
    if (authority_token) {
      setAuthenticated(true);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        authenticated,
        login,
        setAuthenticated,
        totalReports,
        pendingReports,
        approvedReports,
        rejectedReports,
        setTotalReports,
        setPendingReports,
        setApprovedReports,
        setRejectedReports,
        reports,
        setReports,
        theme,
        setTheme,
      }}
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
