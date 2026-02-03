import { useState } from "react";
import {
  AlertTriangle,
  Camera,
  Eye,
  MapPin,
  Shield,
  Users,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import HomepageImage2 from "../assets/billboard-placement.png";
import HomepageImage1 from "../assets/roadside-billboard.png";
import Button from "../component/pageComponet/Button";
import Card from "../component/pageComponet/Card";
import { useAuth } from "../context/AuthContext";

function Home() {
  const { theme } = useAuth();
  const citizen_token = localStorage.getItem("citizen_token");
  const authority_token = localStorage.getItem("authority_token");
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const getStartRedirect = () => {
    if (citizen_token) {
      if (citizen_token) navigate("/citizen-dashboard");
      if (authority_token) navigate("/authority-dashboard");
    } else {
      setShowModal(true);
    }
  };

  const getMapRedirect = () => {
    if (citizen_token) {
      if (citizen_token || authority_token) return "/heatmap";
    } else {
      setShowModal(true);
    }
  };

  const handleLoginRedirect = (type) => {
    setShowModal(false);
    if (type === "citizen") navigate("/login/citizen");
    if (type === "authority") navigate("/login/authority");
  };

  const isDark = theme === "dark";

  return (
    <div
      className={`space-y-20 ${
        isDark ? "bg-[#0A0A0A] text-[#FAFAFA]" : "bg-[#FAFAFA] text-[#0A0A0A]"
      }`}
    >
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div
            className={`rounded-xl shadow-2xl w-11/12 max-w-md p-6 ${
              isDark ? "bg-gray-900 text-white" : "bg-white text-gray-900"
            }`}
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <AlertTriangle
                className={`h-12 w-12 ${
                  isDark ? "text-yellow-400" : "text-yellow-600"
                }`}
              />
              <h2 className="text-2xl font-bold">Please Login First</h2>
              <p className={`${isDark ? "text-gray-300" : "text-gray-700"}`}>
                You need to login to access this feature. Choose your login type
                below:
              </p>
              <div className="flex gap-4 mt-4 w-full justify-center flex-wrap">
                <Button onClick={() => handleLoginRedirect("citizen")}>
                  Citizen Login
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleLoginRedirect("authority")}
                >
                  Authority Login
                </Button>
              </div>
              <button
                className={`mt-4 text-sm ${
                  isDark
                    ? "text-gray-400 hover:text-gray-200"
                    : "text-gray-600 hover:text-gray-800"
                }`}
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="text-center space-y-10">
          <div className="space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              Keep Your City <span className="text-blue-500">Compliant</span>
            </h1>
            <p
              className={`text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              AI-powered platform for detecting and reporting billboard
              violations. Empower authorities and citizens to maintain urban
              compliance with cutting-edge computer vision.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div onClick={getStartRedirect}>
              <Button>Get Started</Button>
            </div>
            <div onClick={getMapRedirect}>
              <Button variant="outline">View Public Map</Button>
            </div>
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

      {/* How It Works */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-6 mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            How It Works
          </h2>
          <p
            className={`text-lg max-w-2xl mx-auto leading-relaxed ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Our platform leverages AI and citizen reporting to streamline the
            detection and management of billboard violations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card
            icon={<Camera className="h-12 w-12 text-blue-500" />}
            title="Citizen Reporting"
            description="Citizens can report violations effortlessly by uploading photos with location data and details."
            className={`transition-colors duration-300 ${
              isDark
                ? "bg-gray-900 hover:bg-gray-800"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          />
          <Card
            icon={<Eye className="h-12 w-12 text-blue-500" />}
            title="AI Detection"
            description="Advanced computer vision identifies size, placement, and content violations automatically."
            className={`transition-colors duration-300 ${
              isDark
                ? "bg-gray-900 hover:bg-gray-800"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          />
          <Card
            icon={<Shield className="h-12 w-12 text-blue-500" />}
            title="Authority Review"
            description="Authorities review and act on violations through an intuitive, comprehensive dashboard."
            className={`transition-colors duration-300 ${
              isDark
                ? "bg-gray-900 hover:bg-gray-800"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          />
          <Card
            icon={<MapPin className="h-12 w-12 text-blue-500" />}
            title="Location Mapping"
            description="Violations are mapped with precise geolocation for seamless tracking and identification."
            className={`transition-colors duration-300 ${
              isDark
                ? "bg-gray-900 hover:bg-gray-800"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          />
          <Card
            icon={<Users className="h-12 w-12 text-blue-500" />}
            title="Community Driven"
            description="Engage citizens in maintaining urban compliance with a user-friendly reporting system."
            className={`transition-colors duration-300 ${
              isDark
                ? "bg-gray-900 hover:bg-gray-800"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          />
          <Card
            icon={<AlertTriangle className="h-12 w-12 text-blue-500" />}
            title="Real-time Alerts"
            description="Receive instant notifications about new violations and updates on reported cases."
            className={`transition-colors duration-300 ${
              isDark
                ? "bg-gray-900 hover:bg-gray-800"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          />
        </div>
      </section>

      {/* Safety Section */}
      <section
        className={`${
          isDark ? "bg-gray-900" : "bg-gray-200"
        } transition-colors duration-300`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Making Cities Safer and Compliant
              </h2>
              <p
                className={`text-lg leading-relaxed ${
                  isDark ? "text-gray-400" : "text-gray-700"
                }`}
              >
                Unauthorized billboards can compromise safety, violate zoning
                laws, and harm urban aesthetics. Our platform unites communities
                and authorities to ensure compliance.
              </p>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <Shield className="h-6 w-6 text-blue-500 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg">Safety First</h3>
                    <p
                      className={`${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Identify hazardous billboard placements to protect public
                      safety.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Eye className="h-6 w-6 text-blue-500 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg">
                      AI-Powered Analysis
                    </h3>
                    <p
                      className={`${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
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
                    <p
                      className={`${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Empower citizens to contribute to a safer, compliant urban
                      environment.
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

      {/* Call to Action */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center space-y-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Make a Difference?
          </h2>
          <p
            className={`text-lg max-w-2xl mx-auto leading-relaxed ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Join thousands of citizens and authorities collaborating to enhance
            urban safety and compliance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div onClick={getStartRedirect}>
              <Button variant="outline">Start reporting</Button>
            </div>
            <Link to={"" ? "/heatmap" : "/about"}>
              <Button variant="outline">Learn More</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
