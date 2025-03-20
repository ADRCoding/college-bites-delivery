
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogIn, UserPlus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);
  
  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const isLoggedIn = localStorage.getItem('userRole') !== null;
  
  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out-expo py-4 px-6 md:px-10",
      isScrolled ? "bg-white/90 backdrop-blur-md shadow-subtle" : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link 
          to="/" 
          className="text-xl font-medium text-collegeBites-darkBlue flex items-center gap-2"
        >
          <span className="inline-block overflow-hidden">
            <span className="animate-fade-in">College</span>
            <span className="font-bold text-collegeBites-blue animate-fade-in animate-delay-100">Bites</span>
          </span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "text-sm font-medium transition-all duration-200 hover:text-collegeBites-blue relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-collegeBites-blue after:transition-all after:duration-300 hover:after:w-full",
                location.pathname === item.path ? "text-collegeBites-blue after:w-full" : "text-collegeBites-text"
              )}
            >
              {item.name}
            </Link>
          ))}
          
          {isLoggedIn ? (
            <Button 
              className="bg-collegeBites-blue hover:bg-collegeBites-darkBlue text-white rounded-full transition-all duration-300 shadow-subtle hover:shadow-lg"
              onClick={() => navigate('/dashboard')}
            >
              Dashboard
            </Button>
          ) : (
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                className="border-collegeBites-blue text-collegeBites-blue hover:bg-collegeBites-blue/10 rounded-full transition-all duration-300 flex items-center gap-1.5"
                onClick={() => navigate('/login')}
              >
                <LogIn size={16} />
                <span>Sign In</span>
              </Button>
              
              <Button 
                className="bg-collegeBites-blue hover:bg-collegeBites-darkBlue text-white rounded-full transition-all duration-300 shadow-subtle hover:shadow-lg flex items-center gap-1.5"
                onClick={() => navigate('/register')}
              >
                <UserPlus size={16} />
                <span>Sign Up</span>
              </Button>
            </div>
          )}
        </nav>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-collegeBites-darkGray p-1"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {/* Mobile Menu */}
      <div className={cn(
        "md:hidden fixed inset-0 bg-white z-40 transition-all duration-300 ease-in-out-expo pt-20 px-6",
        mobileMenuOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none"
      )}>
        <nav className="flex flex-col space-y-6 items-center">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "text-lg font-medium py-2 transition-all duration-200 relative after:absolute after:bottom-0 after:left-1/4 after:right-1/4 after:h-0.5 after:bg-collegeBites-blue after:transition-all after:duration-300",
                location.pathname === item.path ? "text-collegeBites-blue after:opacity-100" : "text-collegeBites-text after:opacity-0"
              )}
            >
              {item.name}
            </Link>
          ))}
          
          {isLoggedIn ? (
            <Button 
              className="bg-collegeBites-blue hover:bg-collegeBites-darkBlue text-white rounded-full transition-all duration-300 mt-4 w-full"
              onClick={() => navigate('/dashboard')}
            >
              Dashboard
            </Button>
          ) : (
            <div className="flex flex-col w-full space-y-3 mt-4">
              <Button 
                variant="outline" 
                className="border-collegeBites-blue text-collegeBites-blue hover:bg-collegeBites-blue/10 rounded-full transition-all duration-300 w-full flex items-center justify-center gap-1.5"
                onClick={() => navigate('/login')}
              >
                <LogIn size={16} />
                <span>Sign In</span>
              </Button>
              
              <Button 
                className="bg-collegeBites-blue hover:bg-collegeBites-darkBlue text-white rounded-full transition-all duration-300 w-full flex items-center justify-center gap-1.5"
                onClick={() => navigate('/register')}
              >
                <UserPlus size={16} />
                <span>Sign Up</span>
              </Button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
