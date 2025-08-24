import { useState } from "react";

export const useGetCitizenInfo = () => {
  const [loading, setLoading] = useState(false);
  const [citizen, setCitizen] = useState(null);
  const [error, setError] = useState("");

  const getCitizenData = async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No citizen token found...");

      const response = await fetch("http://localhost:2000/api/auth-user", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Failed to fetch citizen info");

      setCitizen(data.user);
      return { success: true, citizen: data.user };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return { getCitizenData, citizen, loading, error };
};
