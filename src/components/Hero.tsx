
import { ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Hero = () => {
  return (
    <section className="min-h-screen px-6 md:px-10 pt-28 pb-20 flex flex-col justify-center relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10 opacity-5">
        <div className="absolute top-[20%] left-[15%] w-64 h-64 rounded-full bg-collegeBites-blue blur-[100px]" />
        <div className="absolute bottom-[30%] right-[10%] w-80 h-80 rounded-full bg-collegeBites-blue blur-[120px]" />
      </div>
      
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-6 items-center">
          {/* Text Content */}
          <div className="space-y-8 animate-fade-up">
            <div>
              <div className="inline-block bg-collegeBites-lightBlue text-collegeBites-blue rounded-full px-4 py-1 text-sm font-medium mb-6 animate-scale-in">
                Community-Powered Food Delivery
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight text-collegeBites-text">
                <span className="block">Homemade meals</span>
                <span className="block text-collegeBites-blue">from home to campus</span>
              </h1>
              <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-lg">
                Connecting parents who want to send homemade food to their college students through community carpooling.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-collegeBites-blue hover:bg-collegeBites-darkBlue text-white rounded-full transition-all duration-300 shadow-subtle hover:shadow-lg px-8 py-6 text-base">
                Send Food
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" className="border-collegeBites-blue text-collegeBites-blue hover:bg-collegeBites-lightBlue rounded-full transition-all duration-300 px-8 py-6 text-base">
                How It Works
              </Button>
            </div>
            
            <div className="flex items-center gap-4 mt-8">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className={cn(
                    "w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-collegeBites-gray animate-fade-in",
                    `animate-delay-${i}00`
                  )}>
                    <div className="w-full h-full bg-collegeBites-blue/20 flex items-center justify-center text-xs font-medium text-collegeBites-blue">
                      {String.fromCharCode(64 + i)}
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-medium">200+</span> families already connected
              </div>
            </div>
          </div>
          
          {/* Hero Image */}
          <div className="relative animate-fade-up animate-delay-200">
            <div className="absolute inset-0 -z-10 rounded-3xl bg-collegeBites-lightBlue transform rotate-3 scale-95 transition-all duration-500 group-hover:rotate-1" />
            <div className="bg-white rounded-3xl overflow-hidden shadow-card p-3 transform transition-all duration-500 hover:shadow-lg">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-collegeBites-gray">
                <img 
                  src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81" 
                  alt="College students receiving food packages from parents"
                  className="w-full h-full object-cover transform transition-all duration-700 hover:scale-105"
                />
              </div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute -bottom-6 -left-6 glass p-4 rounded-2xl animate-fade-in animate-delay-300 shadow-subtle max-w-[200px]">
              <div className="text-sm font-medium text-collegeBites-text">Active Deliveries</div>
              <div className="text-2xl font-bold text-collegeBites-blue mt-1">24</div>
              <div className="text-xs text-gray-500 mt-1">Updated just now</div>
            </div>
            
            <div className="absolute -top-4 -right-4 glass p-4 rounded-2xl animate-fade-in animate-delay-400 shadow-subtle">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <div className="text-sm font-medium text-collegeBites-text">15 drivers active now</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
