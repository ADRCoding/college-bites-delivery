
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { cn } from "@/lib/utils";

const testimonials = [
  {
    id: 1,
    name: "Jennifer P.",
    role: "Parent",
    image: null,
    text: "College Bites has been a game-changer for our family. I can send my son his favorite lasagna without expensive shipping, and I know it arrives fresh because a fellow parent delivers it on their way to visit their own child!",
    rating: 5,
  },
  {
    id: 2,
    name: "Michael T.",
    role: "Student",
    image: null,
    text: "Nothing beats mom's home cooking. With College Bites, I get to enjoy dishes from home that I miss so much - it's been great for morale during exam weeks!",
    rating: 5,
  },
  {
    id: 3,
    name: "Sarah K.",
    role: "Driver",
    image: null,
    text: "I visit my daughter every other weekend, and I love being able to help other families by delivering food along the way. It's a wonderful way to build community while helping students eat well.",
    rating: 5,
  },
  {
    id: 4,
    name: "David L.",
    role: "Parent",
    image: null,
    text: "My daughter has dietary restrictions and I worried about her eating well at college. Now I can prepare her special meals and send them through the College Bites network. It's been a huge relief!",
    rating: 5,
  },
];

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };
  
  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };
  
  return (
    <section className="py-24 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fade-up">
          <div className="inline-block bg-collegeBites-lightBlue text-collegeBites-blue rounded-full px-4 py-1 text-sm font-medium mb-6">
            Testimonials
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-collegeBites-text">
            What Our Community Says
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Discover how College Bites is making a difference for parents, students, and community drivers.
          </p>
        </div>
        
        <div className="relative px-4 sm:px-6 md:px-10">
          {/* Desktop Testimonials */}
          <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={testimonial.id}
                className={cn(
                  "glass rounded-2xl p-6 transition-all duration-500 hover:shadow-lg animate-fade-up flex flex-col h-full",
                  `animate-delay-${index % 3 + 1}00`
                )}
              >
                <div className="flex items-start mb-4">
                  <div className="w-10 h-10 rounded-full bg-collegeBites-blue/20 flex items-center justify-center text-collegeBites-blue font-medium">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className="ml-3">
                    <h4 className="font-semibold text-collegeBites-text">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={cn(
                        "h-4 w-4",
                        i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                      )}
                    />
                  ))}
                </div>
                <p className="text-gray-600 flex-grow">{testimonial.text}</p>
              </div>
            ))}
          </div>
          
          {/* Mobile Testimonials */}
          <div className="block md:hidden">
            <div className="glass rounded-2xl p-6 shadow-subtle animate-fade-up">
              <div className="flex items-start mb-4">
                <div className="w-10 h-10 rounded-full bg-collegeBites-blue/20 flex items-center justify-center text-collegeBites-blue font-medium">
                  {testimonials[activeIndex].name.charAt(0)}
                </div>
                <div className="ml-3">
                  <h4 className="font-semibold text-collegeBites-text">{testimonials[activeIndex].name}</h4>
                  <p className="text-sm text-gray-500">{testimonials[activeIndex].role}</p>
                </div>
              </div>
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={cn(
                      "h-4 w-4",
                      i < testimonials[activeIndex].rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                    )}
                  />
                ))}
              </div>
              <p className="text-gray-600">{testimonials[activeIndex].text}</p>
            </div>
            
            <div className="flex justify-center mt-6 gap-4">
              <button 
                onClick={prevTestimonial}
                className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 transition-all hover:bg-collegeBites-lightBlue hover:text-collegeBites-blue shadow-subtle"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button 
                onClick={nextTestimonial}
                className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 transition-all hover:bg-collegeBites-lightBlue hover:text-collegeBites-blue shadow-subtle"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
