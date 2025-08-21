import { useEffect, useState } from "react";

export const AllCitizens = () => {
  const [citizens, setCitizens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCitizens = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:2000/api/authority/getalluser-for-authority", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (data.status && data.users) {
        setCitizens(data.users);
      } else {
        setCitizens([]);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to fetch citizens");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCitizens();
  }, []);

  return { citizens, loading, error, refetch: fetchCitizens };
};
