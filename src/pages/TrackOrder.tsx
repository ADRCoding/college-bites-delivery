
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, MapPin, Package, Check, Truck, Clock, Phone } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const TrackOrder = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [schedule, setSchedule] = useState(null);
  const [locationUpdates, setLocationUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    fetchOrderDetails();
    
    // Set up subscription for real-time location updates
    const channel = supabase
      .channel('location_updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT', 
          schema: 'public',
          table: 'location_updates',
          filter: `order_id=eq.${orderId}`
        },
        (payload) => {
          setLocationUpdates(prev => [payload.new, ...prev]);
          toast.info("Location update received!");
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId, user, navigate]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      
      // Get order details
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .eq('customer_id', user.id)
        .single();
      
      if (orderError) {
        if (orderError.code === 'PGRST116') {
          setError("Order not found or you don't have permission to view it");
        } else {
          throw orderError;
        }
        return;
      }
      
      // Get schedule details
      const { data: scheduleData, error: scheduleError } = await supabase
        .from('driver_schedules')
        .select('*')
        .eq('id', orderData.schedule_id)
        .single();
      
      if (scheduleError) throw scheduleError;
      
      // Get location updates
      const { data: locationData, error: locationError } = await supabase
        .from('location_updates')
        .select('*')
        .eq('order_id', orderId)
        .order('created_at', { ascending: false });
      
      if (locationError) throw locationError;
      
      setOrder(orderData);
      setSchedule(scheduleData);
      setLocationUpdates(locationData || []);
    } catch (error) {
      console.error("Error fetching order details:", error);
      setError("Failed to load tracking information. Please try again later.");
      toast.error("Failed to load tracking information");
    } finally {
      setLoading(false);
    }
  };

  // Format time from database format
  const formatTime = (timeString) => {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(':');
    const time = new Date();
    time.setHours(parseInt(hours, 10));
    time.setMinutes(parseInt(minutes, 10));
    return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Get estimated delivery status and style
  const getDeliveryStatus = () => {
    if (!order) return { status: "Unknown", color: "gray" };
    
    switch (order.status) {
      case 'completed':
        return { status: "Delivered", color: "green" };
      case 'in_transit':
        return { status: "In Transit", color: "blue" };
      default:
        return { status: "Preparing", color: "yellow" };
    }
  };
  
  const deliveryStatus = getDeliveryStatus();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <Button 
              variant="ghost" 
              className="mb-4 flex items-center text-gray-600"
              onClick={() => navigate('/dashboard')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
            
            <h1 className="text-3xl font-bold text-collegeBites-darkBlue">Track Your Delivery</h1>
            <p className="text-gray-600 mt-1">
              Stay updated on your food delivery status
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-collegeBites-blue mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading your delivery information...</p>
            </div>
          ) : error ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-red-500 mb-4">
                  <Package className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{error}</h3>
                <Button 
                  className="mt-4 bg-collegeBites-blue hover:bg-collegeBites-darkBlue"
                  onClick={() => navigate('/dashboard')}
                >
                  Go to Dashboard
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <Card className="mb-6">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>Order #{orderId.substring(0, 8)}</CardTitle>
                      <CardDescription>
                        Placed on {new Date(order.created_at).toLocaleDateString()} at {new Date(order.created_at).toLocaleTimeString()}
                      </CardDescription>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium bg-${deliveryStatus.color}-100 text-${deliveryStatus.color}-800`}>
                      {deliveryStatus.status}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <Package className="h-5 w-5 text-gray-500 mt-0.5" />
                      <div>
                        <h3 className="font-medium">Package Details</h3>
                        <p className="text-gray-600">{order.description || "Food Package"}</p>
                        <p className="text-gray-600">Quantity: {order.quantity} box(es)</p>
                        {order.special_instructions && (
                          <p className="text-gray-600 mt-1">
                            <span className="font-medium">Special Instructions:</span> {order.special_instructions}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    {schedule && (
                      <div className="flex items-start space-x-4">
                        <Truck className="h-5 w-5 text-gray-500 mt-0.5" />
                        <div>
                          <h3 className="font-medium">Delivery Details</h3>
                          <p className="text-gray-600">
                            From <span className="font-medium">{schedule.from_location}</span> to <span className="font-medium">{schedule.to_location}</span>
                          </p>
                          <p className="text-gray-600">
                            Scheduled for {new Date(schedule.departure_date).toLocaleDateString()} at {formatTime(schedule.departure_time)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <h2 className="text-xl font-semibold mb-4">Delivery Progress</h2>
              
              <div className="relative pb-12">
                {/* Vertical timeline line */}
                <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                
                {/* Status timeline */}
                <div className="space-y-8">
                  {locationUpdates.length > 0 ? (
                    locationUpdates.map((update, index) => (
                      <div key={index} className="relative flex items-start group">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-collegeBites-blue ring-8 ring-white z-10">
                          <MapPin className="h-5 w-5" />
                        </div>
                        <div className="ml-6">
                          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                            <div className="flex justify-between">
                              <h3 className="font-medium">Location Update</h3>
                              <time className="text-xs text-gray-500">
                                {new Date(update.created_at).toLocaleTimeString()}
                              </time>
                            </div>
                            <p className="text-gray-600 mt-1">
                              <span className="font-medium">Coordinates:</span> {update.latitude}, {update.longitude}
                            </p>
                            {update.note && (
                              <p className="text-gray-600 mt-1">
                                {update.note}
                              </p>
                            )}
                            <a 
                              href={`https://maps.google.com/?q=${update.latitude},${update.longitude}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-collegeBites-blue hover:underline text-sm mt-2 inline-block"
                            >
                              View on Google Maps →
                            </a>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="relative flex items-start group">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-yellow-100 text-yellow-600 ring-8 ring-white z-10">
                        <Clock className="h-5 w-5" />
                      </div>
                      <div className="ml-6">
                        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                          <h3 className="font-medium">Waiting for Driver Updates</h3>
                          <p className="text-gray-600 mt-1">
                            The driver will update the location when your package is in transit.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="relative flex items-start group">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                      order.status === 'completed' 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-gray-100 text-gray-400'
                    } ring-8 ring-white z-10`}>
                      <Check className="h-5 w-5" />
                    </div>
                    <div className="ml-6">
                      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                        <h3 className="font-medium">
                          {order.status === 'completed' ? 'Delivered' : 'Delivery Pending'}
                        </h3>
                        <p className="text-gray-600 mt-1">
                          {order.status === 'completed' 
                            ? 'Your package has been delivered successfully!' 
                            : 'Your package will be marked as delivered upon arrival.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-lg">Need Help?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    If you have any questions about your delivery, please contact customer service.
                  </p>
                  <Button 
                    variant="outline" 
                    className="w-full flex items-center justify-center gap-2"
                    onClick={() => toast.info("Contact feature coming soon!")}
                  >
                    <Phone className="h-4 w-4" />
                    Contact Support
                  </Button>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TrackOrder;
