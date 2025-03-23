
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, LogIn, LogOut, UserCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut, userType } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    closeMenu();
  };

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-collegeBites-blue">CollegeBites</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center space-x-4">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActivePath("/")
                  ? "text-collegeBites-blue"
                  : "text-gray-600 hover:text-collegeBites-blue"
              }`}
            >
              Home
            </Link>
            <Link
              to="/about"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActivePath("/about")
                  ? "text-collegeBites-blue"
                  : "text-gray-600 hover:text-collegeBites-blue"
              }`}
            >
              About
            </Link>
            <Link
              to="/contact"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActivePath("/contact")
                  ? "text-collegeBites-blue"
                  : "text-gray-600 hover:text-collegeBites-blue"
              }`}
            >
              Contact
            </Link>
            
            {user ? (
              <>
                <Link
                  to={userType === 'driver' ? "/driver-dashboard" : "/dashboard"}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActivePath("/dashboard") || isActivePath("/driver-dashboard")
                      ? "text-collegeBites-blue"
                      : "text-gray-600 hover:text-collegeBites-blue"
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/portal"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActivePath("/portal")
                      ? "text-collegeBites-blue"
                      : "text-gray-600 hover:text-collegeBites-blue"
                  }`}
                >
                  {userType === 'driver' ? 'Schedule Drive' : 'Order Food'}
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="text-gray-600 hover:text-collegeBites-blue flex items-center"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Button
                variant="default"
                size="sm"
                onClick={() => navigate("/login")}
                className="bg-collegeBites-blue hover:bg-collegeBites-darkBlue text-white"
              >
                <LogIn className="h-4 w-4 mr-1" />
                Sign In
              </Button>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-collegeBites-blue focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {isOpen && isMobile && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
            <Link
              to="/"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActivePath("/")
                  ? "text-collegeBites-blue"
                  : "text-gray-600 hover:text-collegeBites-blue"
              }`}
              onClick={closeMenu}
            >
              Home
            </Link>
            <Link
              to="/about"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActivePath("/about")
                  ? "text-collegeBites-blue"
                  : "text-gray-600 hover:text-collegeBites-blue"
              }`}
              onClick={closeMenu}
            >
              About
            </Link>
            <Link
              to="/contact"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActivePath("/contact")
                  ? "text-collegeBites-blue"
                  : "text-gray-600 hover:text-collegeBites-blue"
              }`}
              onClick={closeMenu}
            >
              Contact
            </Link>
            
            {user ? (
              <>
                <Link
                  to={userType === 'driver' ? "/driver-dashboard" : "/dashboard"}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActivePath("/dashboard") || isActivePath("/driver-dashboard")
                      ? "text-collegeBites-blue"
                      : "text-gray-600 hover:text-collegeBites-blue"
                  }`}
                  onClick={closeMenu}
                >
                  Dashboard
                </Link>
                <Link
                  to="/portal"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActivePath("/portal")
                      ? "text-collegeBites-blue"
                      : "text-gray-600 hover:text-collegeBites-blue"
                  }`}
                  onClick={closeMenu}
                >
                  {userType === 'driver' ? 'Schedule Drive' : 'Order Food'}
                </Link>
                <button
                  onClick={handleSignOut}
                  className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-collegeBites-blue"
                >
                  <div className="flex items-center">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </div>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-collegeBites-blue"
                onClick={closeMenu}
              >
                <div className="flex items-center">
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </div>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
