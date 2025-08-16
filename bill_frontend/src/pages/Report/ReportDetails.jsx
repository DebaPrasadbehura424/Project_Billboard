"use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { ArrowLeft, Clock } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const CustomButton = ({
  children,
  onClick,
  variant = "default",
  className = "",
}) => {
  const baseStyles = "px-4 py-2 rounded-md font-medium focus:outline-none";
  const variantStyles = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    ghost: "text-white hover:bg-gray-800",
  };
  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      style={{ transition: "background-color 0.2s" }}
    >
      {children}
    </button>
  );
};

const CustomCard = ({ children, className = "" }) => (
  <div
    className={`bg-gray-800 border border-gray-700 rounded-lg overflow-hidden ${className}`}
    style={{ boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" }}
  >
    {children}
  </div>
);

const CustomCardHeader = ({ children }) => (
  <div className="p-4 border-b border-gray-700">{children}</div>
);

const CustomCardTitle = ({ children }) => (
  <h3 className="text-lg font-bold text-white">{children}</h3>
);

const CustomCardDescription = ({ children }) => (
  <p className="text-gray-400 text-sm">{children}</p>
);

const CustomCardContent = ({ children }) => (
  <div className="p-4">{children}</div>
);

const CustomBadge = ({ children, className = "" }) => (
  <span
    className={`inline-flex items-center px-2 py-1 rounded-md text-sm font-medium ${className}`}
    style={{ backgroundColor: "#4B5563", color: "#D1D5DB" }}
  >
    {children}
  </span>
);

const CustomSeparator = () => <hr className="border-gray-700 my-4" />;

const ReportDetails = () => {
  const { violationId } = useParams(); // get id from URL params
  const [violation, setViolation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchViolation = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(
          `http://localhost:5000/api/reports/${violationId}`
        );
        setViolation(res.data || null);
      } catch (error) {
        console.error("Error fetching violation:", error);
        setViolation(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (violationId) {
      fetchViolation();
    } else {
      setViolation(null);
      setIsLoading(false);
    }
  }, [violationId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        Loading...
      </div>
    );
  }

  if (!violation) {
    return (
      <div className="container mx-auto px-4 py-8 bg-gray-900 text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Violation Not Found</h1>
          <CustomButton
            onClick={() => navigate("/citizen-dashboard")}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
          </CustomButton>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-900 text-white">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <CustomButton
              variant="ghost"
              onClick={() => navigate("/citizen-dashboard")}
              className="text-white"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </CustomButton>
            <div>
              <h1 className="text-3xl font-bold">{violation.title}</h1>
              <p className="text-gray-400">Violation Report #{violation.id}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <CustomCard>
              <CustomCardHeader>
                <CustomCardTitle>Description</CustomCardTitle>
              </CustomCardHeader>
              <CustomCardContent>
                <p className="text-gray-400">{violation.actionDescription}</p>
              </CustomCardContent>
            </CustomCard>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status */}
            <CustomCard>
              <CustomCardHeader>
                <CustomCardTitle>Status</CustomCardTitle>
              </CustomCardHeader>
              <CustomCardContent>
                <CustomBadge className="bg-gray-600 text-white flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{violation.status}</span>
                </CustomBadge>
              </CustomCardContent>
            </CustomCard>

            {/* Report Details */}
            <CustomCard>
              <CustomCardHeader>
                <CustomCardTitle>Report Details</CustomCardTitle>
              </CustomCardHeader>
              <CustomCardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400">Reported by</p>
                  <p className="text-white">
                    {violation.Citizen?.name || "Unknown"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Date Reported</p>
                  <p className="text-white">
                    {new Date(violation.date).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Location</p>
                  <p className="text-white">{violation.location}</p>
                </div>
              </CustomCardContent>
            </CustomCard>

            {/* Category */}
            <CustomCard>
              <CustomCardHeader>
                <CustomCardTitle>Category</CustomCardTitle>
              </CustomCardHeader>
              <CustomCardContent>
                <CustomBadge className="bg-gray-600 text-white capitalize">
                  {violation.category}
                </CustomBadge>
              </CustomCardContent>
            </CustomCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportDetails;
