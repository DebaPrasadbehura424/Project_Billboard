import { useState } from "react";

export const useGetAuthorityInfo = () => {
  const [loading, setLoading] = useState(false);
  const [authority, setAuthority] = useState(null);
  const [error, setError] = useState("");

  const getTheData = async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("authorityToken");
      if (!token) {
        throw new Error("No authority token found...");
      }

      const response = await fetch("http://localhost:2000/api/authority-info", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log("Authority info response:", data);
      console.log(data);
      

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch authority info");
      }

      setAuthority(data.user);

      return { success: true, authority: data.user };

    } catch (err) {
      console.error("Authority fetch error:", err.message);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return { getTheData, authority, loading, error };
};
