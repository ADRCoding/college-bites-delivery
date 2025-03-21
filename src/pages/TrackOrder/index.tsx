
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { OrderDetailCard } from "./components/OrderDetailCard";
import { DeliveryTimeline } from "./components/DeliveryTimeline";
import { SupportCard } from "./components/SupportCard";
import { useOrderData } from "./hooks/useOrderData";

const TrackOrder = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    order,
    schedule,
    locationUpdates,
    loading,
    error,
    deliveryStatus
  } = useOrderData(orderId, user);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
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
          // The hook will handle the updates
          toast.info("Location update received!");
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId, user, navigate]);

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
            <div className="text-red-500 p-4 rounded-md bg-red-50 mb-4">
              <p>{error}</p>
              <Button 
                className="mt-4 bg-collegeBites-blue hover:bg-collegeBites-darkBlue"
                onClick={() => navigate('/dashboard')}
              >
                Go to Dashboard
              </Button>
            </div>
          ) : (
            <>
              {order && <OrderDetailCard order={order} schedule={schedule} deliveryStatus={deliveryStatus} />}
              
              <h2 className="text-xl font-semibold mb-4">Delivery Progress</h2>
              
              <DeliveryTimeline locationUpdates={locationUpdates} orderStatus={order?.status} />
              
              <SupportCard />
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TrackOrder;
