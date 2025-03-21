
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const useLocationUpdates = () => {
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [locationDialogOpen, setLocationDialogOpen] = useState(false);
  const [currentLocation, setCurrentLocation] = useState({
    latitude: "",
    longitude: ""
  });
  const [locationNote, setLocationNote] = useState("");

  const updateDeliveryLocation = (orderId: string) => {
    setActiveOrderId(orderId);
    
    // Try to get current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString()
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          toast.error("Couldn't get current location. Please enter manually.");
        }
      );
    }
    
    setLocationDialogOpen(true);
  };

  const saveLocationUpdate = async () => {
    try {
      if (!activeOrderId || (!currentLocation.latitude && !currentLocation.longitude)) {
        toast.error("Please provide a valid location");
        return;
      }

      // Create a location update in the database
      const { error } = await supabase
        .from('location_updates')
        .insert({
          order_id: activeOrderId,
          latitude: parseFloat(currentLocation.latitude),
          longitude: parseFloat(currentLocation.longitude),
          note: locationNote
        });

      if (error) throw error;
      
      toast.success("Location updated successfully");
      setLocationDialogOpen(false);
      setLocationNote("");
    } catch (error: any) {
      console.error("Error updating location:", error);
      toast.error("Failed to update location");
    }
  };

  return {
    activeOrderId,
    locationDialogOpen,
    currentLocation,
    locationNote,
    setLocationDialogOpen,
    setCurrentLocation,
    setLocationNote,
    updateDeliveryLocation,
    saveLocationUpdate
  };
};
