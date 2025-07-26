import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-blue-700 text-white">
      <div className="container mx-auto px-4 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white">MoveIt</h3>
            <p className="text-blue-100">
              Making delivery simple, fast, and reliable for everyone.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-blue-200 hover:text-white transition-colors"
              >
                <FaFacebookF className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-blue-200 hover:text-white transition-colors"
              >
                <FaTwitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-blue-200 hover:text-white transition-colors"
              >
                <FaInstagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-blue-200 hover:text-white transition-colors"
              >
                <FaLinkedinIn className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-blue-200 hover:text-white transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-blue-200 hover:text-white transition-colors"
                >
                  Services
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-blue-200 hover:text-white transition-colors"
                >
                  Track Package
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-blue-200 hover:text-white transition-colors"
                >
                  Support
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Contact Us</h4>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2 text-blue-100">
                <FaPhoneAlt className="w-4 h-4" />
                <span>+1 234 567 890</span>
              </li>
              <li className="flex items-center space-x-2 text-blue-100">
                <FaEnvelope className="w-4 h-4" />
                <span>contact@deliverease.com</span>
              </li>
              <li className="flex items-center space-x-2 text-blue-100">
                <FaMapMarkerAlt className="w-4 h-4" />
                <span>123 Delivery Street, City</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Newsletter</h4>
            <p className="text-blue-100">
              Subscribe to our newsletter for updates and offers.
            </p>
            <div className="flex flex-col space-y-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-white/90 placeholder:text-gray-500"
              />
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-blue-100">
              © {currentYear} MoveIt. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a
                href="#"
                className="text-sm text-blue-200 hover:text-white transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-sm text-blue-200 hover:text-white transition-colors"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
