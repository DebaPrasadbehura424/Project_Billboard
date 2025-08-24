import { useEffect, useState } from "react";

const API_URL = "http://localhost:2000/api";

export const CitizenReportsForDash = (authenticated) => {
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState({
    totalReports: 0,
    pendingReports: 0,
    approvedReports: 0,
    rejectedReports: 0,
    myReports: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState("Om Prakash Lenka");

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const response = await fetch(`${API_URL}/auth-reporting`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Unauthorized: Invalid or expired token");
        }
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data.status) {
        const fetchedReports = data.reports;
        if (fetchedReports.length > 0 && fetchedReports[0].userName) {
          setUserName(fetchedReports[0].userName);
        }

        const total = fetchedReports.length;
        const pending = fetchedReports.filter((r) => r.status === "pending").length;
        const approved = fetchedReports.filter((r) => r.status === "approved").length;
        const rejected = fetchedReports.filter((r) => r.status === "rejected").length;

        setReports(fetchedReports);
        setStats({
          totalReports: total,
          pendingReports: pending,
          approvedReports: approved,
          rejectedReports: rejected,
          myReports: total,
        });
      } else {
        throw new Error(data.message || "Failed to fetch reports");
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      setError(err.message || "Failed to fetch reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authenticated) {
      fetchReports();
    }
  }, [authenticated]);

  return { reports, stats, loading, error, userName, fetchReports };
};