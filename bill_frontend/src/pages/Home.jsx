import {
  AlertTriangle,
  Camera,
  Eye,
  MapPin,
  Shield,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import HomepageImage2 from "../assets/billboard-placement.png";
import HomepageImage1 from "../assets/roadside-billboard.png";
import Button from "../component/Button";
import Card from "../component/Card";
import { useAuth } from "../middleware/AuthController";
import { UseRollBased } from "../middleware/RollBasedAccessController";

function Home() {
  const { authenticated } = useAuth();
  const { type } = UseRollBased();

  return (
    <div className="space-y-20 bg-[#0A0A0A] text-gray-100">
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="text-center space-y-10">
          <div className="space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              Keep Your City <span className="text-blue-500">Compliant</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              {type === "citizen"
                ? "AI-powered platform for reporting billboard violations. Join citizens in maintaining urban compliance with easy-to-use tools."
                : "AI-powered platform for managing billboard violations. Empower authorities to review and resolve issues with advanced tools."}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to={
                !authenticated
                  ? "/login"
                  : type === "citizen"
                  ? "/citizen-dashboard"
                  : "/authority-dash"
              }
            >
              <Button>
                {type === "citizen" ? "Start Reporting" : "Start Managing"}
              </Button>
            </Link>

            <Link to={authenticated ? "/heatmap" : "/login"}>
              <Button variant="outline">View Public Map</Button>
            </Link>
          </div>

          <div className="mt-20">
            <img
              src={HomepageImage1}
              alt="Billboard detection dashboard"
              className="rounded-xl shadow-2xl mx-auto transform hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-6 mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            How It Works
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            {type === "citizen"
              ? "Report billboard violations easily with our AI-powered platform and help keep your city compliant."
              : "Manage and review billboard violations efficiently with our AI-powered tools designed for authorities."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card
            icon={<Camera className="h-12 w-12 text-blue-500" />}
            title={
              type === "citizen" ? "Citizen Reporting" : "Violation Reports"
            }
            description={
              type === "citizen"
                ? "Citizens can report violations effortlessly by uploading photos with location data and details."
                : "Access and review violation reports submitted by citizens with detailed location and photo data."
            }
            className="bg-gray-900 hover:bg-gray-800 transition-colors duration-300"
          />
          <Card
            icon={<Eye className="h-12 w-12 text-blue-500" />}
            title="AI Detection"
            description="Advanced computer vision identifies size, placement, and content violations automatically."
            className="bg-gray-900 hover:bg-gray-800 transition-colors duration-300"
          />
          <Card
            icon={<Shield className="h-12 w-12 text-blue-500" />}
            title={type === "citizen" ? "Authority Review" : "Review & Resolve"}
            description={
              type === "citizen"
                ? "Authorities review and act on violations through an intuitive, comprehensive dashboard."
                : "Review and resolve reported violations efficiently using a comprehensive authority dashboard."
            }
            className="bg-gray-900 hover:bg-gray-800 transition-colors duration-300"
          />
          <Card
            icon={<MapPin className="h-12 w-12 text-blue-500" />}
            title="Location Mapping"
            description="Violations are mapped with precise geolocation for seamless tracking and identification."
            className="bg-gray-900 hover:bg-gray-800 transition-colors duration-300"
          />
          <Card
            icon={<Users className="h-12 w-12 text-blue-500" />}
            title="Community Driven"
            description={
              type === "citizen"
                ? "Engage with your community to maintain urban compliance with a user-friendly reporting system."
                : "Leverage citizen reports to maintain compliance and foster community engagement."
            }
            className="bg-gray-900 hover:bg-gray-800 transition-colors duration-300"
          />
          <Card
            icon={<AlertTriangle className="h-12 w-12 text-blue-500" />}
            title="Real-time Alerts"
            description={
              type === "citizen"
                ? "Receive instant notifications about updates on your reported violations."
                : "Get real-time alerts for new violation reports and status updates."
            }
            className="bg-gray-900 hover:bg-gray-800 transition-colors duration-300"
          />
        </div>
      </section>

      <section className="bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                {type === "citizen"
                  ? "Help Make Your City Safer"
                  : "Ensure City Compliance"}
              </h2>
              <p className="text-lg text-gray-400 leading-relaxed">
                {type === "citizen"
                  ? "Unauthorized billboards can compromise safety and violate zoning laws. Report violations to contribute to a safer city."
                  : "Unauthorized billboards can disrupt urban safety and compliance. Manage violations to maintain a safe and orderly city."}
              </p>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <Shield className="h-6 w-6 text-blue-500 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg">Safety First</h3>
                    <p className="text-gray-400">
                      {type === "citizen"
                        ? "Report hazardous billboard placements to protect public safety."
                        : "Identify and address hazardous billboard placements to ensure public safety."}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Eye className="h-6 w-6 text-blue-500 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg">
                      AI-Powered Analysis
                    </h3>
                    <p className="text-gray-400">
                      Cutting-edge algorithms reduce manual review time by
                      detecting violations automatically.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Users className="h-6 w-6 text-blue-500 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg">
                      Community Engagement
                    </h3>
                    <p className="text-gray-400">
                      {type === "citizen"
                        ? "Contribute to a safer, compliant urban environment by reporting violations."
                        : "Work with citizen reports to maintain a compliant and engaged community."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <img
                src={HomepageImage2}
                alt="City compliance"
                className="rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center space-y-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            {type === "citizen" ? "Ready to Report?" : "Ready to Manage?"}
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            {type === "citizen"
              ? "Join thousands of citizens reporting violations to enhance urban safety and compliance."
              : "Join authorities in managing violations to ensure a safe and compliant urban environment."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to={
                !authenticated
                  ? "/login"
                  : type === "citizen"
                  ? "/citizen-dashboard"
                  : "/authority-dash"
              }
            >
              <Button>
                {type === "citizen" ? "Start Reporting" : "Start Managing"}
              </Button>
            </Link>
            <Link to={authenticated ? "/heatmap" : "/login"}>
              <Button variant="outline">Learn More</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
