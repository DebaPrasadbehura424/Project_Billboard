import {
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Plus,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../middleware/AuthController";
import CitizenReport from "./CitizenReport";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import CitizenReports from "../../component/authComponent/CitizenReports";
import axios from "axios";

const mockReports = [
  {
    id: "1",
    userId: "1",
    userName: "John Doe",
    title: "Oversized Billboard on Main Street",
    description: "Billboard exceeds permitted size limits by approximately 30%",
    category: "size",
    location: {
      address: "123 Main Street, Downtown",
      coordinates: { lat: 40.7128, lng: -74.006 },
    },
    images: ["/oversized-billboard.png"],
    timestamp: "2024-01-15T10:30:00Z",
    status: "approved",
    reviewedBy: "Authority User",
    reviewedAt: "2024-01-16T14:20:00Z",
    aiAnalysis: {
      confidence: 0.92,
      detectedViolations: ["Size exceeds permitted dimensions"],
      riskLevel: "medium",
    },
  },
  {
    id: "2",
    userId: "1",
    userName: "John Doe",
    title: "Billboard in Restricted Zone",
    description:
      "Billboard placed too close to intersection, creating safety hazard",
    category: "placement",
    location: {
      address: "456 Oak Avenue, Midtown",
      coordinates: { lat: 40.7589, lng: -73.9851 },
    },
    images: ["/intersection-billboard.png"],
    timestamp: "2024-01-12T15:45:00Z",
    status: "pending",
    aiAnalysis: {
      confidence: 0.87,
      detectedViolations: ["Placement violates safety regulations"],
      riskLevel: "high",
    },
  },
  {
    id: "3",
    userId: "1",
    userName: "John Doe",
    title: "Inappropriate Content Display",
    description:
      "Billboard contains content not suitable for family viewing area",
    category: "content",
    location: {
      address: "789 Family Street, Suburbs",
      coordinates: { lat: 40.7282, lng: -73.7949 },
    },
    images: ["/generic-billboard.png"],
    timestamp: "2024-01-10T09:15:00Z",
    status: "rejected",
    reviewedBy: "Authority User",
    reviewedAt: "2024-01-11T11:30:00Z",
    reviewNotes: "Content deemed appropriate after review",
  },
];

function CitizenDashboard({ user }) {
  const { authenticated, setAuthenticated } = useAuth();
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [totalReports, setTotalReports] = useState(0);
  const [pendingReports, setPendingReports] = useState(0);
  const [approvedReports, setApprovedReports] = useState(0);
  const [rejectedReports, setRejectedReports] = useState(0);
  const token = localStorage.getItem("citizen_token");

  const navigate = useNavigate();

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

  const fetchCitizenDetails = async () => {
    // await axios.get("");
    console.log("here");
  };

  useEffect(() => {
    if (authenticated == false) {
      setAuthenticated(true);
      navigate("/");
    }
    if (token != null) {
      fetchCitizenDetails();
    }
  }, []);

  return (
    <div className="space-y-10 bg-[#0A0A0A] text-[#E5E7EB] p-6 sm:p-8 lg:p-12 pt-16 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 border-b border-[#FAFAFA]/20 pb-6">
        <div className="space-y-2">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Welcome back, {user?.name || "Unknown user"}
          </h1>
          <p className="text-lg text-gray-400 leading-relaxed">
            Track your violation reports and contribute to a compliant city
          </p>
        </div>
        <button
          onClick={() => setIsReportDialogOpen(true)}
          className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg border border-blue-500/50"
        >
          <Plus className="mr-2 h-5 w-5" />
          Report Violation
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: "Total Reports",
            value: totalReports,
            color: "text-blue-400",
            icon: <FileText className="h-5 w-5 text-gray-400" />,
            note: "All time submissions",
          },
          {
            label: "Pending",
            value: pendingReports,
            color: "text-yellow-400",
            icon: <Clock className="h-5 w-5 text-gray-400" />,
            note: "Awaiting review",
          },
          {
            label: "Approved",
            value: approvedReports,
            color: "text-green-400",
            icon: <CheckCircle className="h-5 w-5 text-gray-400" />,
            note: "Confirmed violations",
          },
          {
            label: "Rejected",
            value: rejectedReports,
            color: "text-red-400",
            icon: <XCircle className="h-5 w-5 text-gray-400" />,
            note: "Not violations",
          },
        ].map((stat, idx) => (
          <div
            key={idx}
            className="bg-[#0A0A0A]/90 backdrop-blur-md rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 border border-[#FAFAFA]/20"
          >
            <div className="flex flex-row items-center justify-between pb-3">
              <h3 className="text-sm font-semibold text-[#E5E7EB]">
                {stat.label}
              </h3>
              {stat.icon}
            </div>
            <div className={`text-4xl font-extrabold ${stat.color}`}>
              {stat.value}
            </div>
            <p className="text-xs text-gray-400 mt-1">{stat.note}</p>
          </div>
        ))}
      </div>

      {/* Reports History */}
      <CitizenReports
        mockReports={mockReports}
        getStatusIcon={getStatusIcon}
        getStatusColor={getStatusColor}
      />
      {/* Report Violation Modal */}
      <CitizenReport
        open={isReportDialogOpen}
        onOpenChange={setIsReportDialogOpen}
      />
    </div>
  );
}

export default CitizenDashboard;
