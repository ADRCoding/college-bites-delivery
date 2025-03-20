
import { useEffect, useState } from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Mail, MapPin, Phone } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    userType: 'parent'
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    // Scroll to top when the component mounts
    window.scrollTo(0, 0);
  }, []);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message Sent",
        description: "Thank you for contacting us! We'll be in touch soon.",
      });
      setIsSubmitting(false);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        userType: 'parent'
      });
    }, 1500);
  };
  
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-28 pb-20">
        {/* Hero Section */}
        <section className="px-6 md:px-10 mb-12">
          <div className="max-w-7xl mx-auto">
            <div className="text-center animate-fade-up">
              <div className="inline-block bg-collegeBites-lightBlue text-collegeBites-blue rounded-full px-4 py-1 text-sm font-medium mb-6">
                Get In Touch
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-collegeBites-text mb-6">
                Contact Us
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Have questions about how College Bites works? Want to join our community? We'd love to hear from you!
              </p>
            </div>
          </div>
        </section>
        
        {/* Contact Info and Form */}
        <section className="px-6 md:px-10">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
              {/* Contact Information */}
              <div className="lg:col-span-2 animate-fade-up">
                <div className="glass rounded-2xl p-6 md:p-8 h-full">
                  <h2 className="text-2xl font-bold text-collegeBites-text mb-6">Contact Information</h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-collegeBites-lightBlue flex items-center justify-center text-collegeBites-blue shrink-0">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-medium text-collegeBites-text mb-1">Our Address</h3>
                        <p className="text-gray-600">
                          123 University Ave<br />
                          College Town, CA 90210
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-collegeBites-lightBlue flex items-center justify-center text-collegeBites-blue shrink-0">
                        <Mail className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-medium text-collegeBites-text mb-1">Email Us</h3>
                        <a href="mailto:info@collegebites.com" className="text-gray-600 hover:text-collegeBites-blue transition-colors">
                          info@collegebites.com
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-collegeBites-lightBlue flex items-center justify-center text-collegeBites-blue shrink-0">
                        <Phone className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-medium text-collegeBites-text mb-1">Call Us</h3>
                        <a href="tel:+15551234567" className="text-gray-600 hover:text-collegeBites-blue transition-colors">
                          (555) 123-4567
                        </a>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-12">
                    <h3 className="font-medium text-collegeBites-text mb-4">Office Hours</h3>
                    <div className="text-gray-600">
                      <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                      <p>Saturday: 10:00 AM - 4:00 PM</p>
                      <p>Sunday: Closed</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Contact Form */}
              <div className="lg:col-span-3 animate-fade-up animate-delay-200">
                <div className="bg-white rounded-2xl p-6 md:p-8 shadow-card">
                  <h2 className="text-2xl font-bold text-collegeBites-text mb-6">Send Us a Message</h2>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="userType" className="block text-sm font-medium text-gray-700 mb-1">
                        I am a:
                      </label>
                      <select 
                        id="userType"
                        name="userType"
                        value={formData.userType}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-collegeBites-blue focus:border-collegeBites-blue transition-colors"
                      >
                        <option value="parent">Parent</option>
                        <option value="student">Student</option>
                        <option value="driver">Driver</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                          Your Name
                        </label>
                        <input 
                          type="text" 
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-collegeBites-blue focus:border-collegeBites-blue transition-colors"
                          placeholder="John Doe"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Your Email
                        </label>
                        <input 
                          type="email" 
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-collegeBites-blue focus:border-collegeBites-blue transition-colors"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                        Subject
                      </label>
                      <input 
                        type="text" 
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-collegeBites-blue focus:border-collegeBites-blue transition-colors"
                        placeholder="How can we help you?"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                        Your Message
                      </label>
                      <textarea 
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-collegeBites-blue focus:border-collegeBites-blue transition-colors"
                        placeholder="Type your message here..."
                      />
                    </div>
                    
                    <div>
                      <Button 
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-collegeBites-blue hover:bg-collegeBites-darkBlue text-white rounded-lg transition-all duration-300 py-6 text-base"
                      >
                        {isSubmitting ? "Sending..." : "Send Message"}
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Map Section (Placeholder) */}
        <section className="px-6 md:px-10 py-20 mt-12">
          <div className="max-w-7xl mx-auto">
            <div className="bg-collegeBites-lightBlue rounded-2xl overflow-hidden h-96 animate-fade-up">
              <div className="w-full h-full flex items-center justify-center bg-collegeBites-blue/5">
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-collegeBites-text mb-2">Find Us on the Map</h3>
                  <p className="text-gray-600">Interactive map would be displayed here</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
