import { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const AuthContext = createContext(undefined);

// const backendUrl = "https://project-billboard-frontend.vercel.app";
const backendUrl = "http://localhost:8383";

export const AuthProvider = ({ children }) => {
  // const fetchCitizenDetails = async () => {
  //   try {
  //     const response = await axios.get("http://localhost:8383/citizen/me", {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     setCitizen(response.data);

  //     const name = response.data?.name;
  //     const pic = response.data?.photo;

  //     sessionStorage.setItem("citizen_name", name);
  //     sessionStorage.setItem("pic", pic);
  //   } catch (error) {
  //     console.error("Error fetching citizen details:", error);
  //     if (error.response?.status === 401) {
  //       navigate("/");
  //     }
  //   }
  // };

  // useEffect(() => {
  //   if (token) {
  //     fetchCitizenDetails();
  //   }
  // }, [token]);

  // const [totalReports, setTotalReports] = useState(0);
  // const [pendingReports, setPendingReports] = useState(0);
  // const [approvedReports, setApprovedReports] = useState(0);
  // const [rejectedReports, setRejectedReports] = useState(0);
  // const [reports, setReports] = useState([]);

  // const citizen_token = localStorage.getItem("citizen_token");
  // const authority_token = localStorage.getItem("authority_token");

  // useEffect(() => {
  //   if (citizen_token || authority_token) {
  //     setAuthenticated(true);
  //   } else {
  //     setAuthenticated(false);
  //   }
  // }, []);

  // const logout = () => {
  //   localStorage.clear();
  //   sessionStorage.clear();
  //   setAuthenticated(false);
  // };
  const [theme, setTheme] = useState("light");

  return (
    <AuthContext.Provider
      value={{
        // authenticated,
        // login,
        // setAuthenticated,
        // logout,
        // totalReports,
        // pendingReports,
        // approvedReports,
        // rejectedReports,
        // setTotalReports,
        // setPendingReports,
        // setApprovedReports,
        // setRejectedReports,
        // reports,
        // setReports,
        theme,
        setTheme,
        // backendUrl,
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
