
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="text-2xl font-bold text-collegeBites-blue">
              CollegeBites
            </Link>
            <p className="mt-2 text-sm text-gray-500">
              Connecting parents to college students through community carpooling.
            </p>
            <div className="flex space-x-4 mt-4">
              <a
                href="#"
                className="text-gray-400 hover:text-collegeBites-blue"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-collegeBites-blue"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-collegeBites-blue"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
              Services
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/portal" className="text-gray-500 hover:text-collegeBites-blue">
                  Order Food
                </Link>
              </li>
              <li>
                <Link to="/portal" className="text-gray-500 hover:text-collegeBites-blue">
                  Schedule Drive
                </Link>
              </li>
              <li>
                <Link to="/track" className="text-gray-500 hover:text-collegeBites-blue">
                  Track Delivery
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
              Company
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/about" className="text-gray-500 hover:text-collegeBites-blue">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-500 hover:text-collegeBites-blue">
                  Contact
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-collegeBites-blue">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-collegeBites-blue">
                  Blog
                </a>
              </li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
              Legal
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="#" className="text-gray-500 hover:text-collegeBites-blue">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-collegeBites-blue">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-collegeBites-blue">
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 border-t border-gray-200 pt-8 md:flex md:items-center md:justify-between">
          <p className="text-base text-gray-400 md:mt-0">
            &copy; {new Date().getFullYear()} CollegeBites. All rights reserved.
          </p>
          <div className="flex space-x-6 md:order-2 mt-4 md:mt-0">
            <a
              href="mailto:info@collegebites.com"
              className="text-gray-400 hover:text-collegeBites-blue flex items-center"
            >
              <Mail className="h-4 w-4 mr-1" />
              <span className="text-sm">info@collegebites.com</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
