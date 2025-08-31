import {
  Shield,
  Eye,
  Users,
  MapPin,
  Camera,
  AlertTriangle,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

function About() {
  const { theme } = useAuth();
  const isDark = theme === "dark";

  return (
    <div
      className={`space-y-20 ${
        isDark ? "bg-[#0A0A0A] text-[#FAFAFA]" : "bg-[#FAFAFA] text-[#0A0A0A]"
      } transition-colors duration-300`}
    >
      <div
        className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 ${
          isDark ? "bg-[#0A0A0A]" : "bg-white"
        } transition-colors duration-300`}
      >
        <div className="text-center mb-12">
          <h1
            className={`text-4xl font-bold mb-4 ${
              isDark
                ? "text-[#0A0A0A] bg-[#FAFAFA]"
                : "text-[#FAFAFA] bg-[#0A0A0A]"
            } inline-block px-3 py-1 rounded-md`}
          >
            About BillboardWatch
          </h1>
          <p
            className={`text-xl ${isDark ? "text-gray-300" : "text-gray-700"}`}
          >
            Empowering communities through AI-powered billboard compliance
            monitoring
          </p>
        </div>

        <div className="space-y-12">
          <section>
            <h2
              className={`text-2xl font-bold mb-6 ${
                isDark ? "text-[#FAFAFA]" : "text-[#0A0A0A]"
              }`}
            >
              Our Mission
            </h2>
            <p
              className={`text-lg leading-relaxed ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              BillboardWatch is dedicated to creating cleaner, safer, and more
              compliant urban environments through innovative technology and
              community engagement. We believe that by combining artificial
              intelligence with citizen reporting, we can effectively monitor
              and enforce billboard regulations while maintaining transparency
              and accountability.
            </p>
          </section>

          <section>
            <h2
              className={`text-2xl font-bold mb-6 ${
                isDark ? "text-[#FAFAFA]" : "text-[#0A0A0A]"
              }`}
            >
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  icon: <Camera className="h-8 w-8 mb-2" />,
                  title: "Citizen Reporting",
                  desc: "Citizens can easily report suspected violations by uploading photos or videos.",
                },
                {
                  icon: <Eye className="h-8 w-8 mb-2" />,
                  title: "AI Analysis",
                  desc: "Computer vision algorithms analyze submissions to detect violations automatically.",
                },
                {
                  icon: <Users className="h-8 w-8 mb-2" />,
                  title: "Authority Review",
                  desc: "Authorities can review and take action on reported violations.",
                },
                {
                  icon: <MapPin className="h-8 w-8 mb-2" />,
                  title: "Public Transparency",
                  desc: "Heatmaps & statistics provide visibility into violation patterns.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className={`rounded-lg p-6 border transition-colors duration-300 ${
                    isDark
                      ? "bg-white/10 border-gray-700/50 text-[#FAFAFA]"
                      : "bg-gray-100 border-gray-300 text-[#0A0A0A]"
                  }`}
                >
                  {item.icon}
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p
                    className={`${isDark ? "text-gray-300" : "text-gray-700"}`}
                  >
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2
              className={`text-2xl font-bold mb-6 ${
                isDark ? "text-[#FAFAFA]" : "text-[#0A0A0A]"
              }`}
            >
              Types of Violations We Detect
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  icon: <AlertTriangle className="h-6 w-6" />,
                  title: "Size Violations",
                  desc: "Oversized billboards",
                },
                {
                  icon: <MapPin className="h-6 w-6" />,
                  title: "Placement Issues",
                  desc: "Improper positioning",
                },
                {
                  icon: <Eye className="h-6 w-6" />,
                  title: "Content Violations",
                  desc: "Inappropriate content",
                },
                {
                  icon: <Shield className="h-6 w-6" />,
                  title: "Safety Hazards",
                  desc: "Dangerous installations",
                },
                {
                  icon: <Users className="h-6 w-6" />,
                  title: "Permit Issues",
                  desc: "Unauthorized billboards",
                },
                {
                  icon: <Camera className="h-6 w-6" />,
                  title: "Other Violations",
                  desc: "Custom categories",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className={`flex items-center space-x-3 p-4 rounded-lg border transition-colors duration-300 ${
                    isDark
                      ? "bg-white/10 border-gray-700/50 text-[#FAFAFA]"
                      : "bg-gray-100 border-gray-300 text-[#0A0A0A]"
                  }`}
                >
                  {item.icon}
                  <div>
                    <h3 className="font-medium">{item.title}</h3>
                    <p
                      className={`text-sm ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2
              className={`text-2xl font-bold mb-6 ${
                isDark ? "text-[#FAFAFA]" : "text-[#0A0A0A]"
              }`}
            >
              Privacy & Data Handling
            </h2>
            <div
              className={`rounded-lg p-6 border transition-colors duration-300 ${
                isDark
                  ? "bg-white/10 border-gray-700/50 text-[#FAFAFA]"
                  : "bg-gray-100 border-gray-300 text-[#0A0A0A]"
              }`}
            >
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Image Processing</h3>
                  <p
                    className={`text-sm ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Secure AI algorithms analyze billboard content while
                    respecting privacy.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Location Data</h3>
                  <p
                    className={`text-sm ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    GPS data is anonymized in public views and used only for
                    enforcement.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Data Security</h3>
                  <p
                    className={`text-sm ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    All data is encrypted, stored securely, and compliant with
                    privacy laws.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2
              className={`text-2xl font-bold mb-6 ${
                isDark ? "text-[#FAFAFA]" : "text-[#0A0A0A]"
              }`}
            >
              Get Involved
            </h2>
            <p
              className={`text-lg mb-6 ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Join our community of citizens and authorities working together to
              improve urban environments.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              {[
                { title: "For Citizens", desc: "Start reporting violations" },
                { title: "For Authorities", desc: "Access the dashboard" },
              ].map((item, i) => (
                <div
                  key={i}
                  className={`flex-1 rounded-lg p-6 border transition-colors duration-300 ${
                    isDark
                      ? "bg-white/10 border-gray-700/50 text-[#FAFAFA]"
                      : "bg-gray-100 border-gray-300 text-[#0A0A0A]"
                  }`}
                >
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p
                    className={`${isDark ? "text-gray-300" : "text-gray-700"}`}
                  >
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default About;
