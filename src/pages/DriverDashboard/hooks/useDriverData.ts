
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export const useDriverData = () => {
  const { user } = useAuth();
  const [upcomingDrives, setUpcomingDrives] = useState<any[]>([]);
  const [pastDrives, setPastDrives] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDriverData = async () => {
    try {
      setLoading(true);
      const today = new Date().toISOString();
      
      // Fetch upcoming drives
      const { data: upcomingDrivesData, error: upcomingError } = await supabase
        .from('driver_schedules')
        .select('*')
        .eq('driver_id', user?.id)
        .gte('departure_date', today.split('T')[0])
        .order('departure_date', { ascending: true });
      
      if (upcomingError) throw upcomingError;
      
      // Fetch past drives
      const { data: pastDrivesData, error: pastError } = await supabase
        .from('driver_schedules')
        .select('*')
        .eq('driver_id', user?.id)
        .lt('departure_date', today.split('T')[0])
        .order('departure_date', { ascending: false });
      
      if (pastError) throw pastError;
      
      // Fetch orders for upcoming drives
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          *,
          driver_schedules!inner(*)
        `)
        .in('schedule_id', upcomingDrivesData.map(drive => drive.id))
        .order('created_at', { ascending: false });
      
      if (ordersError) throw ordersError;
      
      setUpcomingDrives(upcomingDrivesData);
      setPastDrives(pastDrivesData);
      setOrders(ordersData);
    } catch (error) {
      console.error("Error fetching driver data:", error);
      toast.error("Failed to load driver data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchDriverData();
    }
  }, [user]);

  return {
    upcomingDrives,
    pastDrives,
    orders,
    loading,
    fetchDriverData
  };
};
