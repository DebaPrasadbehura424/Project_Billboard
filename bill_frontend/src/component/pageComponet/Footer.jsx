import React from "react";
import { FaRegNewspaper, FaUserShield } from "react-icons/fa";
import {
  MdDashboard,
  MdEmail,
  MdPhone,
  MdLocationOn,
  MdPrivacyTip,
} from "react-icons/md";
import { IoDocumentTextOutline } from "react-icons/io5";
import { RiBillLine } from "react-icons/ri";
import { useAuth } from "../../context/AuthContext";
import { useLocation } from "react-router-dom";

const Footer = () => {
  const { theme } = useAuth();
  const isDark = theme === "dark";
  const location = useLocation();
  const hideFooterPaths = ["/reelreport", "/leaderboard"];
  const hideFooter = hideFooterPaths.includes(location.pathname);
  return (
    <>
      {!hideFooter && (
        <footer
          className={`py-10 px-6 font-sans transition-colors duration-500 ${
            isDark ? "bg-[#181818] text-[#FAFAFA]" : "bg-gray-100 text-gray-900"
          }`}
        >
          <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            <div>
              <h1
                className={`text-2xl font-bold flex items-center mb-3 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                <RiBillLine className="mr-2 text-teal-400" />
                BillboardWatch
              </h1>
              <p
                className={`${
                  isDark ? "text-gray-300" : "text-gray-700"
                } text-sm leading-relaxed`}
              >
                AI-powered platform for detecting and reporting unauthorized
                billboards to keep our cities compliant and safe.
              </p>
            </div>

            <div>
              <h2
                className={`text-lg font-semibold mb-3 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Quick Links
              </h2>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <FaRegNewspaper
                    className={`${isDark ? "text-gray-400" : "text-gray-600"}`}
                  />
                  <a
                    href="/"
                    className={`hover:text-teal-400 transition-colors ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Home
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <FaUserShield
                    className={`${isDark ? "text-gray-400" : "text-gray-600"}`}
                  />
                  <a
                    href="/about"
                    className={`hover:text-teal-400 transition-colors ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    About
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h2
                className={`text-lg font-semibold mb-3 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Contact
              </h2>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <MdEmail
                    className={`${isDark ? "text-gray-400" : "text-gray-600"}`}
                  />
                  <a
                    href="mailto:support@billboardwatch.com"
                    className={`hover:text-teal-400 transition-colors ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    support@billboardwatch.com
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <MdPhone
                    className={`${isDark ? "text-gray-400" : "text-gray-600"}`}
                  />
                  <a
                    href="tel:+15551234567"
                    className={`hover:text-teal-400 transition-colors ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    +1 (555) 123-4567
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <MdLocationOn
                    className={`${isDark ? "text-gray-400" : "text-gray-600"}`}
                  />
                  <span
                    className={`${isDark ? "text-gray-300" : "text-gray-700"}`}
                  >
                    123 Tech Street, City, ST 12345
                  </span>
                </li>
              </ul>
            </div>

            <div>
              <h2
                className={`text-lg font-semibold mb-3 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Privacy & Legal
              </h2>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <MdPrivacyTip
                    className={`${isDark ? "text-gray-400" : "text-gray-600"}`}
                  />
                  <a
                    href="/privacy-policy"
                    className={`hover:text-teal-400 transition-colors ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Privacy Policy
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <IoDocumentTextOutline
                    className={`${isDark ? "text-gray-400" : "text-gray-600"}`}
                  />
                  <a
                    href="/terms-of-service"
                    className={`hover:text-teal-400 transition-colors ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Terms of Service
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <IoDocumentTextOutline
                    className={`${isDark ? "text-gray-400" : "text-gray-600"}`}
                  />
                  <a
                    href="/data-usage-policy"
                    className={`hover:text-teal-400 transition-colors ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Data Usage Policy
                  </a>
                </li>
              </ul>
              <p
                className={`mt-3 text-sm leading-relaxed ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                We use AI and computer vision to analyze uploaded images.
                Location data is used for mapping violations. All data is
                handled according to our privacy policy.
              </p>
            </div>
          </div>
          <div
            className={`border-t mt-10 pt-5 text-center text-xs transition-colors duration-500 ${
              isDark
                ? "border-gray-700 text-gray-400"
                : "border-gray-300 text-gray-600"
            }`}
          >
            © 2025 BillboardWatch. All rights reserved.
          </div>
        </footer>
      )}
    </>
  );
};

export default Footer;
