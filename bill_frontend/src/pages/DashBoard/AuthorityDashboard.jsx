import React from "react";
import { Plus, FileText, Clock, CheckCircle2, XCircle } from "lucide-react";
import Card from "../../component/citizenComponet/Card";
import { useNavigate } from "react-router-dom";
import CitizenList from "../../component/citizenComponet/CitizenList";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

function AuthorityDashboard() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [approvedReports, setApprovedReports] = useState([]);
  const [PendingReports, setPendingReports] = useState([]);
  const [rejectedReports, setRejectedReports] = useState([]);
  const [totalReports, setTotalReports] = useState([]);
  const { authenticated, setAuthenticated } = useAuth();

  const token = localStorage.getItem("authority_token");

  const fetchCitizenDetails = async () => {
    try {
      const response = await axios.get("http://localhost:8383/citizen/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const citizenId = response.data?.id;
      const name = response.data?.name;

      sessionStorage.setItem("authority", citizenId);
      sessionStorage.setItem("authority_name", name);
    } catch (error) {
      console.error("Error fetching citizen details:", error);
      if (error.response?.status === 401) {
        setAuthenticated(false);
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    if (!authenticated) {
      setAuthenticated(true);
      navigate("/");
    }

    if (token) {
      fetchCitizenDetails();
    }
  }, [token]);

  const fetchReportDetails = async () => {
    await axios
      .get("http://localhost:8383/report/all")
      .then((res) => {
        setReports(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (!authenticated) {
      setAuthenticated(true);
      navigate("/");
    }
    if (token) {
      fetchReportDetails();
    }
  }, []);

  useEffect(() => {
    let pending = 0;
    let approved = 0;
    let rejected = 0;

    reports.forEach((report) => {
      if (report.status === "approved") approved++;
      else if (report.status === "pending") pending++;
      else if (report.status === "rejected") rejected++;
    });

    setTotalReports(reports.length);
    setApprovedReports(approved);
    setPendingReports(pending);
    setRejectedReports(rejected);
  }, [reports]);

  return (
    <div className="bg-[#0a0a0a] min-h-screen p-6 text-[#fafafa] font-sans">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 border-b border-gray-700 pb-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#fafafa] leading-tight">
            Welcome back, Authority
          </h1>
          <p className="text-gray-400 mt-1 max-w-xl">
            Track your violation reports and contribute to a compliant city
          </p>
        </div>
        <button
          type="button"
          className="mt-4 md:mt-0 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg px-5 py-3"
          onClick={() => navigate("/new_violation")}
        >
          <Plus className="w-4 h-4" />
          Check Violation
        </button>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <Card
          title="Total Reports"
          submission={totalReports}
          subtext="All time submissions"
          icons={FileText}
          color="text-sky-400"
        />
        <Card
          title="Pending"
          submission={PendingReports}
          subtext="Awaiting review"
          icons={Clock}
          color="text-yellow-400"
        />
        <Card
          title="Approved"
          submission={approvedReports}
          subtext="Confirmed violations"
          icons={CheckCircle2}
          color="text-green-400"
        />
        <Card
          title="Rejected"
          submission={rejectedReports}
          subtext="Not violations"
          icons={XCircle}
          color="text-red-500"
        />
      </section>
      <CitizenList />
    </div>
  );
}

export default AuthorityDashboard;
