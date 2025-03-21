
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { useDriverData } from "./hooks/useDriverData";
import { useLocationUpdates } from "./hooks/useLocationUpdates";
import { StatsCards } from "./components/StatsCards";
import { UpcomingDrivesTab } from "./components/UpcomingDrivesTab";
import { ActiveOrdersTab } from "./components/ActiveOrdersTab";
import { PastDrivesTab } from "./components/PastDrivesTab";
import { LocationUpdateDialog } from "./components/LocationUpdateDialog";

const DriverDashboard = () => {
  const navigate = useNavigate();
  const { user, signOut, userType } = useAuth();
  const { upcomingDrives, pastDrives, orders, loading } = useDriverData();
  const {
    locationDialogOpen,
    currentLocation,
    locationNote,
    setLocationDialogOpen,
    setCurrentLocation,
    setLocationNote,
    updateDeliveryLocation,
    saveLocationUpdate
  } = useLocationUpdates();

  // Check if user is a driver
  useEffect(() => {
    if (userType && userType !== 'driver') {
      navigate('/dashboard');
    }
  }, [userType, navigate]);

  // Check if user is logged in
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-collegeBites-darkBlue">Driver Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Manage your scheduled drives and deliveries
              </p>
            </div>
            <Button 
              variant="outline"
              className="flex gap-2 items-center"
              onClick={handleLogout}
            >
              <LogOut size={16} />
              Sign Out
            </Button>
          </div>

          <StatsCards 
            upcomingDrivesCount={upcomingDrives.length}
            ordersCount={orders.length}
            pastDrivesCount={pastDrives.length}
          />

          <Tabs defaultValue="upcoming" className="space-y-6">
            <TabsList>
              <TabsTrigger value="upcoming">Upcoming Drives</TabsTrigger>
              <TabsTrigger value="orders">Active Orders</TabsTrigger>
              <TabsTrigger value="past">Past Drives</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upcoming">
              <UpcomingDrivesTab drives={upcomingDrives} loading={loading} />
            </TabsContent>
            
            <TabsContent value="orders">
              <ActiveOrdersTab 
                orders={orders} 
                loading={loading} 
                updateDeliveryLocation={updateDeliveryLocation} 
              />
            </TabsContent>
            
            <TabsContent value="past">
              <PastDrivesTab drives={pastDrives} loading={loading} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <LocationUpdateDialog
        open={locationDialogOpen}
        onOpenChange={setLocationDialogOpen}
        currentLocation={currentLocation}
        locationNote={locationNote}
        setCurrentLocation={setCurrentLocation}
        setLocationNote={setLocationNote}
        saveLocationUpdate={saveLocationUpdate}
      />
      
      <Footer />
    </div>
  );
};

export default DriverDashboard;
