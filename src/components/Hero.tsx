
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  const navigate = useNavigate();
  
  return (
    <section className="min-h-screen flex items-center relative overflow-hidden pt-20">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-white z-0"></div>
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6 max-w-lg">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-collegeBites-darkBlue leading-tight">
              <span className="block">Homemade Food for</span>
              <span className="text-collegeBites-blue">College Students</span>
            </h1>
            
            <p className="text-lg text-gray-600">
              Connecting parents who want to send homemade food to their college students through community carpooling.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                className="bg-collegeBites-blue hover:bg-collegeBites-darkBlue text-white rounded-full py-6 px-8 text-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                onClick={() => navigate('/register')}
              >
                Get Started
                <ArrowRight size={18} />
              </Button>
              
              <Button 
                variant="outline" 
                className="border-collegeBites-blue text-collegeBites-blue hover:bg-collegeBites-blue/10 rounded-full py-6 px-8 text-lg transition-all duration-300"
                onClick={() => {
                  const howItWorksSection = document.getElementById('how-it-works');
                  if (howItWorksSection) {
                    howItWorksSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                Learn More
              </Button>
            </div>
            
            <div className="pt-4 text-sm text-gray-500">
              Join our growing community of
              <div className="flex gap-4 mt-3">
                <div className="flex items-center">
                  <div className="bg-green-100 p-2 rounded-full mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
                    </svg>
                  </div>
                  <span>500+ Parents</span>
                </div>
                <div className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-full mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                      <path d="M18 8V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2v-2"></path>
                      <path d="M18 12h4"></path>
                      <path d="M9 5v14"></path>
                    </svg>
                  </div>
                  <span>1,000+ Students</span>
                </div>
                <div className="flex items-center">
                  <div className="bg-purple-100 p-2 rounded-full mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600">
                      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C1.4 11.3 1 12.1 1 13v3c0 .6.4 1 1 1h2"></path>
                      <circle cx="7" cy="17" r="2"></circle>
                      <path d="M9 17h6"></path>
                      <circle cx="17" cy="17" r="2"></circle>
                    </svg>
                  </div>
                  <span>200+ Drivers</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative hidden lg:flex items-center justify-center">
            <div className="bg-white p-4 rounded-lg shadow-xl transform rotate-3 transition-transform duration-500 hover:rotate-0">
              <img 
                src="https://source.unsplash.com/random/800x600/?homemade-food" 
                alt="Homemade Food" 
                className="rounded-md w-full h-auto"
              />
            </div>
            <div className="absolute -top-10 right-0 bg-white p-3 rounded-lg shadow-lg transform rotate-6 transition-transform duration-500 hover:rotate-0 z-20">
              <img 
                src="https://source.unsplash.com/random/300x200/?cooking" 
                alt="Cooking" 
                className="rounded-md w-48 h-auto"
              />
            </div>
            <div className="absolute -bottom-5 -left-10 bg-white p-3 rounded-lg shadow-lg transform -rotate-6 transition-transform duration-500 hover:rotate-0 z-20">
              <img 
                src="https://source.unsplash.com/random/300x200/?college-students" 
                alt="College Students" 
                className="rounded-md w-48 h-auto"
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-center animate-bounce hidden md:block">
        <p className="text-sm text-gray-500 mb-2">Scroll to learn more</p>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-gray-400">
          <path d="M12 5v14"></path>
          <path d="m19 12-7 7-7-7"></path>
        </svg>
      </div>
      
      <div className="absolute top-40 left-10 animate-float opacity-20 hidden xl:block">
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      
      <div className="absolute bottom-60 right-20 animate-float animation-delay-300 opacity-20 hidden xl:block">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="2" width="20" height="20" rx="2" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </section>
  );
};

export default Hero;
