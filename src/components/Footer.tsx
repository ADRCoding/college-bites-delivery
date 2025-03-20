
import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-collegeBites-lightBlue py-16 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="col-span-1 md:col-span-2">
            <Link 
              to="/" 
              className="text-xl font-medium text-collegeBites-darkBlue flex items-center gap-2 mb-4"
            >
              <span>College</span>
              <span className="font-bold text-collegeBites-blue">Bites</span>
            </Link>
            <p className="text-gray-600 mb-6 max-w-md">
              Connecting parents who want to send homemade food to their college students through community carpooling.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-600">
                <MapPin className="h-5 w-5 text-collegeBites-blue" />
                <span>123 University Ave, College Town, CA 90210</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Mail className="h-5 w-5 text-collegeBites-blue" />
                <a href="mailto:info@collegebites.com" className="hover:text-collegeBites-blue transition-colors">
                  info@collegebites.com
                </a>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Phone className="h-5 w-5 text-collegeBites-blue" />
                <a href="tel:+15551234567" className="hover:text-collegeBites-blue transition-colors">
                  (555) 123-4567
                </a>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4 text-collegeBites-text">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { name: 'Home', path: '/' },
                { name: 'About Us', path: '/about' },
                { name: 'How It Works', path: '/#how-it-works' },
                { name: 'Contact', path: '/contact' },
              ].map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path}
                    className="text-gray-600 hover:text-collegeBites-blue transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4 text-collegeBites-text">Resources</h3>
            <ul className="space-y-3">
              {[
                { name: 'Safety Guidelines', path: '#' },
                { name: 'Community Rules', path: '#' },
                { name: 'Food Safety Tips', path: '#' },
                { name: 'FAQ', path: '#' },
              ].map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path}
                    className="text-gray-600 hover:text-collegeBites-blue transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-6 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} College Bites. All rights reserved.
            </p>
            <div className="flex gap-6">
              {['Terms', 'Privacy Policy', 'Cookies'].map((item) => (
                <Link 
                  key={item}
                  to="#"
                  className="text-sm text-gray-500 hover:text-collegeBites-blue transition-colors"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
