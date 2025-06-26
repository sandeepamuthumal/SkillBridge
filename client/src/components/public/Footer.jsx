
import {
  Building2,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
function Footer() {
  return (
    <footer className="bg-secondary-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <span className="ml-2 text-xl font-bold">SkillBridge</span>
            </div>
            <p className="text-secondary-300 text-sm">
              Connecting talent with opportunity. Find your dream job or hire
              the perfect candidate.
            </p>
            <div className="flex space-x-4">
              <div className="flex items-center text-secondary-300 text-sm">
                <MapPin className="w-4 h-4 mr-2" />
                Colombo, Sri Lanka
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {["Find Jobs", "Post Jobs", "Companies", "Candidates"].map(
                (link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-secondary-300 hover:text-white text-sm transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              {[
                "Help Center",
                "Contact Us",
                "Privacy Policy",
                "Terms of Service",
              ].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-secondary-300 hover:text-white text-sm transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="space-y-2">
              <div className="flex items-center text-secondary-300 text-sm">
                <Phone className="w-4 h-4 mr-2" />
                +94 11 234 5678
              </div>
              <div className="flex items-center text-secondary-300 text-sm">
                <Mail className="w-4 h-4 mr-2" />
                hello@skillbridge.com
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-secondary-800 mt-8 pt-8 text-center">
          <p className="text-secondary-300 text-sm">
            © 2025 SkillBridge. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
