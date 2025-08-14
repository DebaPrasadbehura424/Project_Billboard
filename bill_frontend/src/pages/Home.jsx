import {
  AlertTriangle,
  Camera,
  Eye,
  MapPin,
  Shield,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../component/Button";
import Card from "../component/Card";

function Home() {
  return (
    <div className="space-y-20">
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              Keep Your City <span className="text-blue-600">Compliant</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              AI-powered billboard violation detection and reporting platform.
              Help authorities maintain urban compliance through citizen
              reporting and computer vision technology.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button>Get Started</Button>
            </Link>
            <Link to="/heatmap">
              <Button variant="outline">View Public Map</Button>
            </Link>
          </div>

          <div className="mt-16">
            <img
              src="/roadside-billboard.png"
              alt="Billboard detection dashboard"
              className="rounded-lg shadow-2xl mx-auto"
            />
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold">How It Works</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Our platform combines AI technology with citizen reporting to
            identify and track billboard violations efficiently.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card
            icon={<Camera className="h-12 w-12 text-blue-600" />}
            title="Citizen Reporting"
            description="Citizens can easily report violations by uploading photos with location data and violation details."
          />
          <Card
            icon={<Eye className="h-12 w-12 text-blue-600" />}
            title="AI Detection"
            description="Advanced computer vision algorithms analyze images to detect size, placement, and content violations automatically."
          />
          <Card
            icon={<Shield className="h-12 w-12 text-blue-600" />}
            title="Authority Review"
            description="Authorities can review, verify, and take action on reported violations through a comprehensive dashboard."
          />
          <Card
            icon={<MapPin className="h-12 w-12 text-blue-600" />}
            title="Location Mapping"
            description="All violations are mapped with precise geolocation data for easy identification and tracking."
          />
          <Card
            icon={<Users className="h-12 w-12 text-blue-600" />}
            title="Community Driven"
            description="Engage citizens in maintaining urban compliance through an easy-to-use reporting system."
          />
          <Card
            icon={<AlertTriangle className="h-12 w-12 text-blue-600" />}
            title="Real-time Alerts"
            description="Get instant notifications about new violations and status updates on reported cases."
          />
        </div>
      </section>

      {/* About Section */}
      <section className="bg-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl sm:text-4xl font-bold">
                Making Cities Safer and More Compliant
              </h2>
              <p className="text-lg text-gray-600">
                Unauthorized billboards can pose safety hazards, violate zoning
                laws, and detract from urban aesthetics. Our platform empowers
                communities and authorities to work together in maintaining
                compliance.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Shield className="h-6 w-6 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold">Safety First</h3>
                    <p className="text-gray-600">
                      Identify hazardous billboard placements that could
                      endanger public safety.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Eye className="h-6 w-6 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold">AI-Powered Analysis</h3>
                    <p className="text-gray-600">
                      Advanced algorithms detect violations automatically,
                      reducing manual review time.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Users className="h-6 w-6 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold">Community Engagement</h3>
                    <p className="text-gray-600">
                      Enable citizens to actively participate in maintaining
                      their urban environment.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <img
                src="/billboard-placement.png"
                alt="City compliance"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-8">
          <h2 className="text-3xl sm:text-4xl font-bold">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join thousands of citizens and authorities working together to
            maintain urban compliance and safety.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button>Start Reporting</Button>
            </Link>
            <Link to="/about">
              <Button variant="outline">Learn More</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
