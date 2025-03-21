
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
        .select('*')
        .gte('departure_date', today.split('T')[0])
        .order('departure_date', { ascending: true });
      
      if (upcomingError) throw upcomingError;
      
      // Get past schedules
      const { data: past, error: pastError } = await supabase
        .from('driver_schedules')
        .select('*')
        .lt('departure_date', today.split('T')[0])
        .order('departure_date', { ascending: false });
      
      if (pastError) throw pastError;
      
      // Format the data for display
      const formattedUpcoming = upcoming.map(drive => ({
        id: drive.id,
        driver: drive.driver_id ? drive.driver_id.substring(0, 8) : 'Unknown',
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
        driver: drive.driver_id ? drive.driver_id.substring(0, 8) : 'Unknown',
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
      <main className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-4">Driver Portal</h1>
        <p className="mb-8">Schedule and manage your drives</p>
        
        {/* Portal content placeholder */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Coming Soon</h2>
          <p>The driver portal is under development. Check back soon for updates!</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Portal;
