import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(() => {
    return (
      localStorage.getItem("citizen_token") !== null ||
      localStorage.getItem("authority_token") !== null
    );
  });

  const [totalReports, setTotalReports] = useState(0);
  const [pendingReports, setPendingReports] = useState(0);
  const [approvedReports, setApprovedReports] = useState(0);
  const [rejectedReports, setRejectedReports] = useState(0);
  const [reports, setReports] = useState([]);
  const [theme, setTheme] = useState(true);

  const citizen_token = localStorage.getItem("citizen_token");
  const authority_token = localStorage.getItem("authority_token");
  useEffect(() => {
    if (citizen_token || authority_token) {
      setAuthenticated(true);
    } else {
      setAuthenticated(false);
    }
  }, []);

  const logout = () => {
    localStorage.clear();
    sessionStorage.clear();
    setAuthenticated(false);
  };

  const login = () => {
    const citizen_token = localStorage.getItem("citizen_token");
    const authority_token = localStorage.getItem("authority_token");
    if (citizen_token || authority_token) {
      setAuthenticated(true);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        authenticated,
        login,
        setAuthenticated,
        logout,
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
