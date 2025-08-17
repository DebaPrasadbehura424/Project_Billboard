import React from "react";
import { useParams } from "react-router-dom";
import CitizenReports from "../../component/authComponent/CitizenReports";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Plus,
  XCircle,
} from "lucide-react";
function ShowReports() {
  const { citizenReportId } = useParams();

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
    <div>
      <CitizenReports
        mockReports={mockReports}
        getStatusIcon={getStatusIcon}
        getStatusColor={getStatusColor}
      />
    </div>
  );
}

export default ShowReports;
