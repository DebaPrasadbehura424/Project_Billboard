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

// Mock data
const mockStats = {
  totalReports: 12,
  pendingReports: 3,
  approvedReports: 7,
  rejectedReports: 2,
  myReports: 12,
};

const mockReports = [
  {
    id: "1",
    userId: "1",
    userName: "John Doe",
    title: "Oversized Billboard on Main Street",
    description:
      "Billboard exceeds permitted size limits by approximately 30%",
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
  const { authenticated } = useAuth();
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);

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

  if (!authenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0A0A0A] text-red-400 text-lg font-semibold">
        Unauthorized access — please log in first.
      </div>
    );
  }

  return (
    <div className="space-y-10 bg-[#0A0A0A] text-[#E5E7EB] p-6 sm:p-8 lg:p-12 pt-16 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 border-b border-[#FAFAFA]/20 pb-6">
        <div className="space-y-2">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Welcome back, {user?.name || "Om Prakash Lenka"}
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
          { label: "Total Reports", value: mockStats.myReports, color: "text-blue-400", icon: <FileText className="h-5 w-5 text-gray-400" />, note: "All time submissions" },
          { label: "Pending", value: mockStats.pendingReports, color: "text-yellow-400", icon: <Clock className="h-5 w-5 text-gray-400" />, note: "Awaiting review" },
          { label: "Approved", value: mockStats.approvedReports, color: "text-green-400", icon: <CheckCircle className="h-5 w-5 text-gray-400" />, note: "Confirmed violations" },
          { label: "Rejected", value: mockStats.rejectedReports, color: "text-red-400", icon: <XCircle className="h-5 w-5 text-gray-400" />, note: "Not violations" },
        ].map((stat, idx) => (
          <div
            key={idx}
            className="bg-[#0A0A0A]/90 backdrop-blur-md rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 border border-[#FAFAFA]/20"
          >
            <div className="flex flex-row items-center justify-between pb-3">
              <h3 className="text-sm font-semibold text-[#E5E7EB]">{stat.label}</h3>
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
      <div className="bg-[#0A0A0A]/90 backdrop-blur-md rounded-xl shadow-md overflow-hidden border border-[#FAFAFA]/20">
        <div className="p-6 border-b border-[#FAFAFA]/20">
          <h2 className="text-3xl font-extrabold text-[#E5E7EB]">
            Your Reports
          </h2>
          <p className="text-sm text-gray-400 mt-2">
            History of all violation reports you've submitted
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#0A0A0A]/95 border-b border-[#FAFAFA]/20">
              <tr>
                <th className="p-4 text-sm font-semibold text-[#E5E7EB]">
                  Title
                </th>
                <th className="p-4 text-sm font-semibold text-[#E5E7EB]">
                  Category
                </th>
                <th className="p-4 text-sm font-semibold text-[#E5E7EB]">
                  Location
                </th>
                <th className="p-4 text-sm font-semibold text-[#E5E7EB]">
                  Date
                </th>
                <th className="p-4 text-sm font-semibold text-[#E5E7EB]">
                  Status
                </th>
                <th className="p-4 text-sm font-semibold text-[#E5E7EB]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {mockReports.map((report) => (
                <tr
                  key={report.id}
                  className="border-b border-[#FAFAFA]/20 hover:bg-[#0A0A0A]/70 transition-colors duration-200"
                >
                  <td className="p-4 font-medium text-[#E5E7EB]">
                    {report.title}
                  </td>
                  <td className="p-4">
                    <span className="capitalize inline-block px-3 py-1 text-xs font-medium text-[#E5E7EB] border border-[#FAFAFA]/20 rounded-full bg-[#0A0A0A]/90">
                      {report.category}
                    </span>
                  </td>
                  <td className="p-4 max-w-[200px] truncate text-gray-300">
                    {report.location.address}
                  </td>
                  <td className="p-4 text-gray-300">
                    {new Date(report.timestamp).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <span
                      className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border border-[#FAFAFA]/20 ${getStatusColor(
                        report.status
                      )}`}
                    >
                      {getStatusIcon(report.status)}
                      <span className="capitalize">{report.status}</span>
                    </span>
                  </td>
                  <td className="p-4">
                    <button className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors duration-200">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Report Violation Modal */}
      <CitizenReport
        open={isReportDialogOpen}
        onOpenChange={setIsReportDialogOpen}
      />
    </div>
  );
}

export default CitizenDashboard;
