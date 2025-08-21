import { useEffect, useState } from "react";

export const GetAuthorityStatus = () => {
  const [status, setStatus] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const GetFetchStatus = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "http://localhost:2000/api/status/citizen-status",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();
        console.log("API response 👉", data);

        // ✅ use the array inside `data`
        if (data && Array.isArray(data.data)) {
          setStatus(data.data);
        } else {
          setStatus([]);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    GetFetchStatus();
  }, []); // ✅ only run once

  // ---- Calculate stats safely ----
  const total = status.length;
  const pending = status.filter((s) => s === "pending").length;
  const approved = status.filter((s) => s === "approved").length;
  const rejected = status.filter((s) => s === "rejected").length;

  const stats = { total, pending, approved, rejected };

  return { status, stats, loading };
};
