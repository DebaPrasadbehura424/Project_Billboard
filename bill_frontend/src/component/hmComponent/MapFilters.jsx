import { Filter, Search } from "lucide-react";
import { useState } from "react";

/**
 * @param {Array} reports - Full list of reports to filter
 * @param {Function} setFilteredReports - Setter to update filtered reports
 */
function MapFilters({ originalReports, setReports }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All statuses");
  const [category, setCategory] = useState("All categories");
  const [risk, setRisk] = useState("All risk levels");
  const handleSubmit = (e) => {
    e.preventDefault();

    const filtered = originalReports?.filter((report) => {
      const matchesSearch =
        search.trim() === "" ||
        report.title.toLowerCase().includes(search.toLowerCase()) ||
        report.description.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        status === "All statuses" ||
        report.status?.toLowerCase() === status.toLowerCase();

      const matchesCategory =
        category === "All categories" ||
        report.category?.toLowerCase() === category.toLowerCase();

      const matchesRisk =
        risk === "All risk levels" ||
        report.risk_level?.toLowerCase() === risk.toLowerCase();

      return matchesSearch && matchesStatus && matchesCategory && matchesRisk;
    });

    setReports(filtered);
  };

  const handleReset = () => {
    setSearch("");
    setStatus("All statuses");
    setCategory("All categories");
    setRisk("All risk levels");
    setReports(originalReports);
  };

  const selectClasses =
    "w-full rounded-lg border border-gray-700 bg-[#0A0A0A] py-2 text-sm text-[#fafafa] transition duration-200 ease-in-out hover:bg-[#121212]";

  return (
    <div
      className="max-w-full rounded-lg border border-gray-700 bg-[#0a0a0a] p-6 text-white mb-10"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      <div className="flex items-center gap-2 mb-1">
        <Filter size={16} />
        <h2 className="font-semibold text-lg">Map Filters</h2>
      </div>
      <p className="text-sm text-gray-300 mb-6">
        Filter violations shown on the map
      </p>

      <form
        onSubmit={handleSubmit}
        onReset={handleReset}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-4"
      >
        {/* Search */}
        <div className="flex flex-col">
          <label htmlFor="search" className="text-sm font-semibold mb-1">
            Search
          </label>
          <div className="relative">
            <input
              id="search"
              type="search"
              placeholder="Search violations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-md border border-gray-700 bg-[#121212] py-2 pl-10 pr-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#121212]"
            />
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
          </div>
        </div>

        {/* Status */}
        <div className="flex flex-col">
          <label htmlFor="status" className="text-sm font-semibold mb-1">
            Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className={selectClasses}
          >
            <option>All statuses</option>
            <option>Pending</option>
            <option>Approved</option>
            <option>Rejected</option>
            <option>Under Review</option>
          </select>
        </div>

        {/* Category */}
        <div className="flex flex-col">
          <label htmlFor="category" className="text-sm font-semibold mb-1">
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={selectClasses}
          >
            <option>All categories</option>
            <option>Size</option>
            <option>Placement</option>
            <option>Content</option>
            <option>Hazard</option>
          </select>
        </div>

        {/* Risk */}
        <div className="flex flex-col">
          <label htmlFor="risk" className="text-sm font-semibold mb-1">
            Risk Level
          </label>
          <select
            id="risk"
            value={risk}
            onChange={(e) => setRisk(e.target.value)}
            className={selectClasses}
          >
            <option>All risk levels</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="flex items-center space-x-4 col-span-full mt-2">
          <button
            type="submit"
            className="rounded-md bg-[#fafafa] py-2 px-4 text-sm transition"
            style={{ color: "#0A0A0A" }}
          >
            Apply Filters
          </button>
          <button
            type="reset"
            className="rounded-md border border-gray-700 bg-transparent py-2 px-4 text-sm text-[#fafafa] hover:bg-gray-800 transition"
          >
            Clear Filters
          </button>
        </div>
      </form>

      <style>
        {`
          select option:hover {
            background-color: #121212 !important;
            color: #fff !important;
          }
        `}
      </style>
    </div>
  );
}

export default MapFilters;
