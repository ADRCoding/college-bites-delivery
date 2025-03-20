
import { Package, Users, TruckIcon, UtensilsCrossed } from 'lucide-react';
import { cn } from "@/lib/utils";

const steps = [
  {
    id: 1,
    title: "Parents Prepare Food",
    description: "Parents prepare homemade meals with care for their college students.",
    icon: UtensilsCrossed,
    color: "bg-blue-50 text-blue-600",
  },
  {
    id: 2,
    title: "Schedule a Pickup",
    description: "Post your delivery need and connect with drivers heading to campus.",
    icon: Package,
    color: "bg-indigo-50 text-indigo-600",
  },
  {
    id: 3,
    title: "Community Drivers",
    description: "Volunteer drivers or parents already making the trip deliver the food.",
    icon: TruckIcon,
    color: "bg-purple-50 text-purple-600",
  },
  {
    id: 4,
    title: "Students Enjoy Home Cooking",
    description: "Students receive the taste of home without the shipping costs.",
    icon: Users,
    color: "bg-sky-50 text-sky-600",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 px-6 md:px-10 bg-collegeBites-lightBlue">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fade-up">
          <div className="inline-block bg-white text-collegeBites-blue rounded-full px-4 py-1 text-sm font-medium mb-6">
            How College Bites Works
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-collegeBites-text">
            Connecting Families Through Food
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Our community-powered approach makes sending home-cooked meals to college students simple, affordable, and meaningful.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div 
              key={step.id}
              className={cn(
                "glass rounded-2xl p-6 transition-all duration-500 hover:shadow-lg animate-fade-up",
                `animate-delay-${index + 1}00`
              )}
            >
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center mb-4",
                step.color
              )}>
                <step.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-collegeBites-text mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-16 bg-white rounded-2xl p-6 md:p-8 shadow-card animate-fade-up animate-delay-500">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-collegeBites-text mb-4">Join our growing community</h3>
              <p className="text-gray-600 mb-6">
                College Bites connects parents who want to send homemade food to their children with community members already making the trip to campus.
              </p>
              <ul className="space-y-3">
                {[
                  "Save on expensive shipping",
                  "Share rides and resources",
                  "Support students with homemade meals",
                  "Build community connections"
                ].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <div className="h-5 w-5 rounded-full bg-collegeBites-blue/10 flex items-center justify-center text-collegeBites-blue shrink-0 mt-0.5">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <span className="ml-2 text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="rounded-xl overflow-hidden shadow-subtle">
                <img 
                  src="https://images.unsplash.com/photo-1519389950473-47ba0277781c" 
                  alt="College Bites Community" 
                  className="w-full h-full object-cover aspect-[3/2]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
