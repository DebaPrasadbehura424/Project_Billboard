import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export const useAiAnalysis = () => {
    const { reportId } = useParams();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [analysisData, setAnalysisData] = useState(null);

    const getAiAnalysis = async (id = reportId) => {
        if (!id) {
            setError("No report ID provided");
            return null;
        }

        setLoading(true);
        setError(null);
        
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("No authentication token found");
            }

            const response = await fetch(`http://localhost:2000/api/ai-analysis/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.status && data.data) {
                setAnalysisData(data.data);
                return data.data;
            } else {
                throw new Error(data.message || "Failed to fetch analysis data");
            }
        } catch (err) {
            setError(err.message);
            console.error("AI Analysis Error:", err);
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Automatically fetch when hook is used with reportId in URL
    useEffect(() => {
        if (reportId) {
            getAiAnalysis();
        }
    }, [reportId]);

    return {
        loading,
        error,
        analysisData,
        getAiAnalysis,
        reportId
    };
};