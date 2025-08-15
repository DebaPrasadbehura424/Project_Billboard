import { Clock, AlertTriangle, CheckCircle, XCircle } from "lucide-react";

function MapLegend() {
  return (
    <div
      className="max-w-full rounded-lg border border-gray-800 p-6 bg-[#0A0A0A] text-[#FAFAFA]"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      {/* Title */}
      <h3 className="text-[#FAFAFA] font-bold text-lg mb-6">Map Legend</h3>

      {/* Row with all sections */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-8">
        {/* Status */}
        <div className="flex flex-col space-y-4 min-w-[140px]">
          <h4 className="text-[#FAFAFA] font-semibold mb-3 text-md">Status</h4>
          <div className="flex flex-col space-y-2">
            <span className="inline-flex items-center gap-1 bg-[#262626] rounded-md px-3 py-[4px] text-xs font-bold text-[#FAFAFA] w-max">
              <Clock size={14} /> Pending
            </span>
            <span className="inline-flex items-center gap-1 bg-[#262626] rounded-md px-3 py-[4px] text-xs font-bold text-[#FAFAFA] w-max">
              <AlertTriangle size={14} /> Under Review
            </span>
            <span className="inline-flex items-center gap-1 bg-[#FAFAFA] rounded-md px-3 py-[4px] text-xs font-bold text-[#0A0A0A] w-max">
              <CheckCircle size={14} /> Approved
            </span>
            <span className="inline-flex items-center gap-1 bg-[#521213] rounded-md px-3 py-[4px] text-xs font-bold text-[#FAFAFA] w-max">
              <XCircle size={14} /> Rejected
            </span>
          </div>
        </div>

        {/* Risk */}
        <div className="flex flex-col space-y-4 min-w-[180px]">
          <h4 className="text-[#FAFAFA] font-semibold mb-3 text-md">
            Risk Level
          </h4>
          <div className="flex flex-col space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="inline-block bg-[#521213] rounded-md px-3 py-[4px] text-xs font-bold text-[#FAFAFA]">
                High Risk
              </span>
              <span className="text-gray-400">Safety concerns</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block bg-gray-700 rounded-md px-3 py-[4px] text-xs font-bold text-[#FAFAFA]">
                Medium Risk
              </span>
              <span className="text-gray-400">Compliance issues</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block border border-gray-700 bg-[#0A0A0A] rounded-md px-3 py-[4px] text-xs font-bold text-[#FAFAFA]">
                Low Risk
              </span>
              <span className="text-gray-400">Minor violations</span>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-col space-y-4 min-w-[220px]">
          <h4 className="text-[#FAFAFA] font-semibold mb-3 text-md">
            Categories
          </h4>
          <div className="flex flex-col space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="inline-block border border-gray-700 bg-[#0A0A0A] rounded-md px-3 py-[4px] text-xs font-bold text-[#FAFAFA]">
                Size
              </span>
              <span className="text-gray-400">Dimension violations</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block bg-[#262626] rounded-md px-3 py-[4px] text-xs font-bold text-[#FAFAFA]">
                Placement
              </span>
              <span className="text-gray-400">Location issues</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block border border-gray-700 bg-[#0A0A0A] rounded-md px-3 py-[4px] text-xs font-bold text-[#FAFAFA]">
                Content
              </span>
              <span className="text-gray-400">Inappropriate content</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block border border-gray-700 bg-[#0A0A0A] rounded-md px-3 py-[4px] text-xs font-bold text-[#FAFAFA]">
                Hazard
              </span>
              <span className="text-gray-400">Safety hazards</span>
            </div>
          </div>
        </div>

        {/* Help */}
        <div className="flex flex-col space-y-4 min-w-[280px]">
          <h4 className="text-[#FAFAFA] font-semibold mb-3 text-md">
            How to Help
          </h4>
          <ul className="list-disc list-inside text-gray-400 text-sm space-y-2">
            <li>Report new violations you discover</li>
            <li>Provide clear photos and descriptions</li>
            <li>Include accurate location information</li>
            <li>Help keep your community compliant</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default MapLegend;
