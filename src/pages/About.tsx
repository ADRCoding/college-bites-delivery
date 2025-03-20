
import { useEffect } from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";

const About = () => {
  useEffect(() => {
    // Scroll to top when the component mounts
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-28 pb-20">
        {/* Hero Section */}
        <section className="px-6 md:px-10 mb-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center animate-fade-up">
              <div className="inline-block bg-collegeBites-lightBlue text-collegeBites-blue rounded-full px-4 py-1 text-sm font-medium mb-6">
                Our Story
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-collegeBites-text mb-6">
                About College Bites
              </h1>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                We're building a community-powered network that connects families and helps students enjoy the comfort of home-cooked meals.
              </p>
            </div>
          </div>
        </section>
        
        {/* Mission Section */}
        <section className="px-6 md:px-10 mb-20">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="relative animate-fade-up">
                <div className="rounded-2xl overflow-hidden shadow-card">
                  <img 
                    src="https://images.unsplash.com/photo-1721322800607-8c38375eef04" 
                    alt="College Bites Mission" 
                    className="w-full h-full object-cover aspect-[4/3]"
                  />
                </div>
              </div>
              <div className="space-y-6 animate-fade-up animate-delay-200">
                <h2 className="text-3xl font-bold text-collegeBites-text">Our Mission</h2>
                <p className="text-gray-600">
                  College Bites was born from a simple observation: parents want to send their children homemade food at college, but shipping is expensive and often results in food arriving in less-than-ideal condition.
                </p>
                <p className="text-gray-600">
                  We recognized that many parents regularly drive to visit their children at college, and these trips could be leveraged to create a community-based delivery network for homemade meals.
                </p>
                <p className="text-gray-600">
                  Our mission is to foster a supportive community that helps college students maintain their connection to home through the universal language of food, while promoting resource sharing and reducing the environmental impact of individual deliveries.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Values Section */}
        <section className="px-6 md:px-10 py-20 bg-collegeBites-lightBlue">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 animate-fade-up">
              <h2 className="text-3xl font-bold text-collegeBites-text mb-4">
                Our Values
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                The principles that guide everything we do at College Bites.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Community First",
                  description: "We believe in the power of community to solve problems and create meaningful connections.",
                  color: "bg-blue-50 border-blue-100"
                },
                {
                  title: "Food is Love",
                  description: "Homemade food carries emotions, traditions, and care that can't be replicated by restaurant or dining hall meals.",
                  color: "bg-indigo-50 border-indigo-100"
                },
                {
                  title: "Sustainability",
                  description: "By sharing resources and coordinating deliveries, we reduce environmental impact while building a stronger community.",
                  color: "bg-purple-50 border-purple-100"
                }
              ].map((value, index) => (
                <div 
                  key={value.title}
                  className={`glass rounded-2xl p-6 transition-all duration-500 hover:shadow-lg animate-fade-up ${value.color} animate-delay-${index + 1}00`}
                >
                  <h3 className="text-xl font-semibold text-collegeBites-text mb-4">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Team Section (Placeholder) */}
        <section className="px-6 md:px-10 py-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 animate-fade-up">
              <h2 className="text-3xl font-bold text-collegeBites-text mb-4">
                Our Team
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Meet the passionate individuals behind College Bites.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { name: "Alex Morgan", role: "Founder & CEO" },
                { name: "Jamie Chen", role: "Operations Director" },
                { name: "Taylor Williams", role: "Community Manager" },
                { name: "Jordan Smith", role: "Tech Lead" },
              ].map((member, index) => (
                <div 
                  key={member.name}
                  className={`glass rounded-2xl p-6 text-center transition-all duration-500 hover:shadow-lg animate-fade-up animate-delay-${index % 4 + 1}00`}
                >
                  <div className="w-24 h-24 bg-collegeBites-blue/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl font-medium text-collegeBites-blue">
                      {member.name.charAt(0)}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-collegeBites-text">{member.name}</h3>
                  <p className="text-sm text-gray-500">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="px-6 md:px-10 py-20 bg-collegeBites-lightBlue">
          <div className="max-w-3xl mx-auto text-center animate-fade-up">
            <h2 className="text-3xl font-bold text-collegeBites-text mb-6">
              Ready to Join Our Community?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Whether you're a parent wanting to send food, a student missing home cooking, or someone who can help with deliveries, we'd love to have you.
            </p>
            <Button className="bg-collegeBites-blue hover:bg-collegeBites-darkBlue text-white rounded-full transition-all duration-300 shadow-subtle hover:shadow-lg px-8 py-6 text-base">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
