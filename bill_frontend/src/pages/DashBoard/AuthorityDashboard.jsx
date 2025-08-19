import { CheckCircle2, Clock, FileText, Plus, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Card from "../../component/AuthorityDashComp/Card";
import CitizenList from "../../component/AuthorityDashComp/CitizenList";
import { GetAuthorityStatus } from "../../hooks/Authority/AuthorityStatusForcitizen";

function AuthorityDashboard() {
  const navigate = useNavigate();
  const { stats } = GetAuthorityStatus(); // ✅ get stats directly from hook

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
          onClick={() => navigate("/pending-citizen-reports")}
        >
          <Plus className="w-4 h-4" />
          Check Violation
        </button>
      </header>

      {/* Status Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <Card
          title="Total Reports"
          submission={stats.total}
          subtext="All time submissions"
          icons={FileText}
          color="text-sky-400"
        />
        <Card
          title="Pending"
          submission={stats.pending}
          subtext="Awaiting review"
          icons={Clock}
          color="text-yellow-400"
        />
        <Card
          title="Approved"
          submission={stats.approved}
          subtext="Confirmed violations"
          icons={CheckCircle2}
          color="text-green-400"
        />
        <Card
          title="Rejected"
          submission={stats.rejected}
          subtext="Not violations"
          icons={XCircle}
          color="text-red-500"
        />
      </section>

      {/* Citizen reports list */}
      <CitizenList />
    </div>
  );
}

export default AuthorityDashboard;
