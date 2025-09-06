import React from "react";
import { Clock, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import CitizenReportsList from "../../component/citizenComponet/CitizenReportsList";

function CitizenProfile() {
  const user = {
    name: "Alice Johnson",
    role: "Citizen",
    points: 1200,
    photo: "https://randomuser.me/api/portraits/women/44.jpg",
    joined: "2024-06-15",
  };

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
            src={user.photo}
            alt={user.name}
            className="w-20 h-20 rounded-full border-2 border-purple-400 object-cover"
          />
          <div>
            <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
            <p className="text-gray-500">{user.role}</p>
            <p className="mt-1 text-sm text-gray-600">
              Points:{" "}
              <span className="text-purple-600 font-bold">{user.points}</span>
            </p>
            <p className="text-sm text-gray-600">Joined: {user.joined}</p>
          </div>
        </div>

        {/* Citizen Reports List */}
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
