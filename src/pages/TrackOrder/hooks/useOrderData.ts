
import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useOrderData = (orderId: string | undefined, user: User | null) => {
  const [order, setOrder] = useState(null);
  const [schedule, setSchedule] = useState(null);
  const [locationUpdates, setLocationUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
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

  useEffect(() => {
    if (!orderId || !user) return;
    
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

    fetchOrderDetails();
    
    // Set up subscription for real-time location updates
    const channel = supabase
      .channel(`order_location_${orderId}`)
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
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId, user]);

  return {
    order,
    schedule,
    locationUpdates,
    loading,
    error,
    deliveryStatus
  };
};
