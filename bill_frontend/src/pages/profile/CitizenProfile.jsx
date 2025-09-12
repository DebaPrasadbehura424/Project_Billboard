import React, { useEffect, useState } from "react";
import { Clock, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import CitizenReportsList from "../../component/citizenComponet/CitizenReportsList";
import axios from "axios";

function CitizenProfile() {
  const [user, setUser] = useState(null);
  const citizenId = sessionStorage.getItem("citizenId");
  const deafult =
    "data:image/jpeg;base64,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";

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.post("http://localhost:8383/citizen/getById", {
          citizenId: citizenId,
        });
        const userData = {
          ...res.data,
          photo: res.data?.photo || deafult,
        };
        setUser(userData);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    if (citizenId) fetchUser();
  }, [citizenId]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "approved":
        return <CheckCircle className="h-4 w-4" />;
      case "rejected":
        return <XCircle className="h-4 w-4" />;
      case "under-review":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-900/30 text-yellow-400 border-yellow-500/40 hover:bg-yellow-900/50";
      case "approved":
        return "bg-green-900/30 text-green-400 border-green-500/40 hover:bg-green-900/50";
      case "rejected":
        return "bg-red-900/30 text-red-400 border-red-500/40 hover:bg-red-900/50";
      case "under-review":
        return "bg-orange-900/30 text-orange-400 border-orange-500/40 hover:bg-orange-900/50";
      default:
        return "bg-yellow-900/30 text-yellow-400 border-yellow-500/40 hover:bg-yellow-900/50";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 space-y-8">
      <div className="bg-white shadow-lg rounded-2xl max-w-2xl mx-auto p-6">
        <div className="flex items-center gap-6">
          <img
            src={user?.photo}
            alt={user?.name}
            className="w-20 h-20 rounded-full border-2 border-purple-400 object-cover"
          />
          <div>
            <h2 className="text-xl font-bold text-gray-800">{user?.name}</h2>
            <p className="text-gray-500">Role: {user?.role}</p>
            <p className="mt-1 text-sm text-gray-600">
              Points:{" "}
              <span className="text-purple-600 font-bold">{user?.points}</span>
            </p>
          </div>
        </div>

        <div className="mt-6 border-t pt-4">
          <CitizenReportsList
            getStatusIcon={getStatusIcon}
            getStatusColor={getStatusColor}
          />
        </div>
      </div>
    </div>
  );
}

export default CitizenProfile;
