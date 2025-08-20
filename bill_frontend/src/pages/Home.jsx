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
import Button from "../component/Button";
import Card from "../component/Card";
import { useAuth } from "../middleware/AuthController";
import { useEffect } from "react";

function Home() {
  const { authenticated, theme } = useAuth();
  const citizen_token = localStorage.getItem("citizen_token");
  const authority_token = localStorage.getItem("authority_token");
  const getStartRedirect = () => {
    if (authenticated) {
      if (citizen_token) return "/citizen-dashboard";
      if (authority_token) return "/authority-dashboard";
    }
    return "/login";
  };
  const getMapRedirect = () => {
    if (authenticated) {
      if (citizen_token || authority_token) return "/heatmap";
    }
    return "/login";
  };

  return (
    <div
      className={`space-y-20 
        ${theme ? "bg-[#0A0A0A]" : "bg-[#FAFAFA]"}
       ${theme ? "text-[#FAFAFA]" : "text-[#0A0A0A]"}
     `}
    >
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="text-center space-y-10">
          <div className="space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              Keep Your City <span className="text-blue-500">Compliant</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              AI-powered platform for detecting and reporting billboard
              violations. Empower authorities and citizens to maintain urban
              compliance with cutting-edge computer vision.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={getStartRedirect()}>
              <Button>Get Started</Button>
            </Link>
            <Link to={getMapRedirect()}>
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
            Our platform leverages AI and citizen reporting to streamline the
            detection and management of billboard violations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card
            icon={<Camera className="h-12 w-12 text-blue-500" />}
            title="Citizen Reporting"
            description="Citizens can report violations effortlessly by uploading photos with location data and details."
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
            title="Authority Review"
            description="Authorities review and act on violations through an intuitive, comprehensive dashboard."
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
            description="Engage citizens in maintaining urban compliance with a user-friendly reporting system."
            className="bg-gray-900 hover:bg-gray-800 transition-colors duration-300"
          />
          <Card
            icon={<AlertTriangle className="h-12 w-12 text-blue-500" />}
            title="Real-time Alerts"
            description="Receive instant notifications about new violations and updates on reported cases."
            className="bg-gray-900 hover:bg-gray-800 transition-colors duration-300"
          />
        </div>
      </section>

      <section className="bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Making Cities Safer and Compliant
              </h2>
              <p className="text-lg text-gray-400 leading-relaxed">
                Unauthorized billboards can compromise safety, violate zoning
                laws, and harm urban aesthetics. Our platform unites communities
                and authorities to ensure compliance.
              </p>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <Shield className="h-6 w-6 text-blue-500 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg">Safety First</h3>
                    <p className="text-gray-400">
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

      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center space-y-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Make a Difference?
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Join thousands of citizens and authorities collaborating to enhance
            urban safety and compliance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={authenticated ? "/citizen-dashboard" : "/login"}>
              <Button>Start Reporting</Button>
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
