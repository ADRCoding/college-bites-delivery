
// Update the fetchSchedules function in Portal.tsx to correctly map Supabase data

const fetchSchedules = async () => {
  try {
    setLoading(true);
    const today = new Date().toISOString();
    
    // Get upcoming schedules
    const { data: upcoming, error: upcomingError } = await supabase
      .from('driver_schedules')
      .select('*, users:driver_id(email)')
      .gte('departure_date', today.split('T')[0])
      .order('departure_date', { ascending: true });
    
    if (upcomingError) throw upcomingError;
    
    // Get past schedules
    const { data: past, error: pastError } = await supabase
      .from('driver_schedules')
      .select('*, users:driver_id(email)')
      .lt('departure_date', today.split('T')[0])
      .order('departure_date', { ascending: false });
    
    if (pastError) throw pastError;
    
    // Format the data for display
    const formattedUpcoming = upcoming.map(drive => ({
      id: drive.id,
      driver: drive.users?.email ? drive.users.email.split('@')[0] : 'Unknown',
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
      driver: drive.users?.email ? drive.users.email.split('@')[0] : 'Unknown',
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
