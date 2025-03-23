
import { 
  UserPlus, 
  Calendar, 
  Package, 
  Map, 
  CreditCard 
} from "lucide-react";

const steps = [
  {
    title: "Create an Account",
    description: "Sign up as a parent looking to send food or as a driver willing to transport packages.",
    icon: UserPlus,
  },
  {
    title: "Find a Route",
    description: "Browse available drivers making trips from your location to your student's college.",
    icon: Map,
  },
  {
    title: "Schedule a Delivery",
    description: "Select a date and time that works for you and the driver.",
    icon: Calendar,
  },
  {
    title: "Prepare Your Package",
    description: "Package your home-cooked meals securely for transport.",
    icon: Package,
  },
  {
    title: "Pay Securely",
    description: "Complete your booking with our secure payment system.",
    icon: CreditCard,
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-16 bg-collegeBites-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            How CollegeBites Works
          </h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Connecting parents and college students through a simple, secure process
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="bg-white rounded-lg p-6 shadow-sm relative">
              <div className="w-12 h-12 bg-collegeBites-blue text-white rounded-full flex items-center justify-center mb-4">
                <step.icon size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {step.title}
              </h3>
              <p className="text-gray-600">{step.description}</p>
              
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 w-8 h-1 bg-collegeBites-blue"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
