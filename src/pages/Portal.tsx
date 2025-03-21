
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Portal = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [upcomingDrives, setUpcomingDrives] = useState([]);
  const [pastDrives, setPastDrives] = useState([]);

  useEffect(() => {
    fetchSchedules();
  }, []);

  // Format time from database format
  const formatTime = (timeString) => {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(':');
    const time = new Date();
    time.setHours(parseInt(hours, 10));
    time.setMinutes(parseInt(minutes, 10));
    return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const today = new Date().toISOString();
      
      // Get upcoming schedules
      const { data: upcoming, error: upcomingError } = await supabase
        .from('driver_schedules')
        .select('*, driver:driver_id(email)')
        .gte('departure_date', today.split('T')[0])
        .order('departure_date', { ascending: true });
      
      if (upcomingError) throw upcomingError;
      
      // Get past schedules
      const { data: past, error: pastError } = await supabase
        .from('driver_schedules')
        .select('*, driver:driver_id(email)')
        .lt('departure_date', today.split('T')[0])
        .order('departure_date', { ascending: false });
      
      if (pastError) throw pastError;
      
      // Format the data for display
      const formattedUpcoming = upcoming.map(drive => ({
        id: drive.id,
        driver: drive.driver?.email ? drive.driver.email.split('@')[0] : 'Unknown',
        driverId: drive.driver_id,
        from: drive.from_location,
        to: drive.to_location,
        date: new Date(drive.departure_date),
        time: formatTime(drive.departure_time),
        capacity: drive.capacity,
        available: drive.available_capacity,
      }));
      
      const formattedPast = past.map(drive => ({
        id: drive.id,
        driver: drive.driver?.email ? drive.driver.email.split('@')[0] : 'Unknown',
        driverId: drive.driver_id,
        from: drive.from_location,
        to: drive.to_location,
        date: new Date(drive.departure_date),
        time: formatTime(drive.departure_time),
        capacity: drive.capacity,
        available: drive.available_capacity,
      }));
      
      setUpcomingDrives(formattedUpcoming);
      setPastDrives(formattedPast);
    } catch (error) {
      console.error("Error fetching schedules:", error);
      toast.error("Failed to load driver schedules");
    } finally {
      setLoading(false);
    }
  };

  // Rest of component implementation
  return (
    <div>
      <Header />
      <main>
        {/* Portal content goes here */}
        <h1>Portal Page</h1>
      </main>
      <Footer />
    </div>
  );
};

export default Portal;
