
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { LogOut, Users, Car, Package, MapPin, Calendar, Clock, Map } from "lucide-react";
import { format, parseISO } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const DriverDashboard = () => {
  const navigate = useNavigate();
  const { user, signOut, userType } = useAuth();
  const [upcomingDrives, setUpcomingDrives] = useState([]);
  const [pastDrives, setPastDrives] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeOrderId, setActiveOrderId] = useState(null);
  const [locationDialogOpen, setLocationDialogOpen] = useState(false);
  const [currentLocation, setCurrentLocation] = useState({
    latitude: "",
    longitude: ""
  });
  const [locationNote, setLocationNote] = useState("");

  // Check if user is a driver
  useEffect(() => {
    if (userType && userType !== 'driver') {
      navigate('/dashboard');
    }
  }, [userType, navigate]);

  // Fetch data
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    fetchDriverData();
  }, [user, navigate]);

  const fetchDriverData = async () => {
    try {
      setLoading(true);
      const today = new Date().toISOString();
      
      // Fetch upcoming drives
      const { data: upcomingDrivesData, error: upcomingError } = await supabase
        .from('driver_schedules')
        .select('*')
        .eq('driver_id', user.id)
        .gte('departure_date', today.split('T')[0])
        .order('departure_date', { ascending: true });
      
      if (upcomingError) throw upcomingError;
      
      // Fetch past drives
      const { data: pastDrivesData, error: pastError } = await supabase
        .from('driver_schedules')
        .select('*')
        .eq('driver_id', user.id)
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

  const handleLogout = async () => {
    await signOut();
  };

  const updateDeliveryLocation = async (orderId) => {
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
    } catch (error) {
      console.error("Error updating location:", error);
      toast.error("Failed to update location");
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Upcoming Drives</CardTitle>
                <Car className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{upcomingDrives.length}</div>
                <p className="text-xs text-muted-foreground">Scheduled trips</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{orders.length}</div>
                <p className="text-xs text-muted-foreground">Packages to deliver</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed Drives</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pastDrives.length}</div>
                <p className="text-xs text-muted-foreground">Past trips</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="upcoming" className="space-y-6">
            <TabsList>
              <TabsTrigger value="upcoming">Upcoming Drives</TabsTrigger>
              <TabsTrigger value="orders">Active Orders</TabsTrigger>
              <TabsTrigger value="past">Past Drives</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upcoming" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Your Upcoming Drives</h2>
                <Button 
                  className="bg-collegeBites-blue hover:bg-collegeBites-darkBlue"
                  onClick={() => navigate('/portal')}
                >
                  Schedule New Drive
                </Button>
              </div>
              
              <div className="bg-white rounded-lg shadow overflow-hidden">
                {loading ? (
                  <div className="p-8 text-center">
                    <p>Loading your drives...</p>
                  </div>
                ) : upcomingDrives.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Route</TableHead>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Capacity</TableHead>
                        <TableHead>Available</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {upcomingDrives.map((drive) => (
                        <TableRow key={drive.id}>
                          <TableCell>
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                              {drive.from_location} to {drive.to_location}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                                {new Date(drive.departure_date).toLocaleDateString()}
                              </div>
                              <div className="flex items-center mt-1">
                                <Clock className="h-4 w-4 mr-1 text-gray-500" />
                                {formatTime(drive.departure_time)}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{drive.capacity}</TableCell>
                          <TableCell>{drive.available_capacity}</TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => navigate('/portal')}
                            >
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="p-8 text-center">
                    <Car className="h-12 w-12 mx-auto text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No upcoming drives</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      You haven't scheduled any upcoming drives.
                    </p>
                    <div className="mt-6">
                      <Button 
                        onClick={() => navigate('/portal')}
                        className="bg-collegeBites-blue hover:bg-collegeBites-darkBlue"
                      >
                        Schedule a Drive
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="orders" className="space-y-4">
              <h2 className="text-xl font-semibold">Active Orders to Deliver</h2>
              
              <div className="bg-white rounded-lg shadow overflow-hidden">
                {loading ? (
                  <div className="p-8 text-center">
                    <p>Loading orders...</p>
                  </div>
                ) : orders.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order Details</TableHead>
                        <TableHead>Route</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell>
                            <div className="font-medium">{order.description || "Food Package"}</div>
                            <div className="text-sm text-gray-500">Quantity: {order.quantity}</div>
                            {order.special_instructions && (
                              <div className="text-xs text-gray-500 mt-1">
                                Note: {order.special_instructions}
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            {order.driver_schedules.from_location} to {order.driver_schedules.to_location}
                          </TableCell>
                          <TableCell>
                            {new Date(order.driver_schedules.departure_date).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              order.status === 'completed' ? 'bg-green-100 text-green-800' :
                              order.status === 'in_transit' ? 'bg-blue-100 text-blue-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {order.status === 'pending' ? 'Pending' : 
                               order.status === 'in_transit' ? 'In Transit' : 
                               'Completed'}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => updateDeliveryLocation(order.id)}
                              >
                                <Map className="h-4 w-4 mr-1" />
                                Update Location
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="p-8 text-center">
                    <Package className="h-12 w-12 mx-auto text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No active orders</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      You don't have any orders to deliver at the moment.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="past" className="space-y-4">
              <h2 className="text-xl font-semibold">Your Past Drives</h2>
              
              <div className="bg-white rounded-lg shadow overflow-hidden">
                {loading ? (
                  <div className="p-8 text-center">
                    <p>Loading past drives...</p>
                  </div>
                ) : pastDrives.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Route</TableHead>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Capacity</TableHead>
                        <TableHead>Utilization</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pastDrives.map((drive) => (
                        <TableRow key={drive.id}>
                          <TableCell>
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                              {drive.from_location} to {drive.to_location}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                                {new Date(drive.departure_date).toLocaleDateString()}
                              </div>
                              <div className="flex items-center mt-1">
                                <Clock className="h-4 w-4 mr-1 text-gray-500" />
                                {formatTime(drive.departure_time)}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{drive.capacity}</TableCell>
                          <TableCell>
                            {drive.capacity - drive.available_capacity} / {drive.capacity} used
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="p-8 text-center">
                    <Car className="h-12 w-12 mx-auto text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No past drives</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      You haven't completed any drives yet.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Dialog open={locationDialogOpen} onOpenChange={setLocationDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update Delivery Location</DialogTitle>
            <DialogDescription>
              Update the current location of this delivery to keep customers informed.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="latitude">Latitude</Label>
                <Input 
                  id="latitude" 
                  value={currentLocation.latitude}
                  onChange={(e) => setCurrentLocation({...currentLocation, latitude: e.target.value})}
                  placeholder="e.g. 34.0522"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="longitude">Longitude</Label>
                <Input 
                  id="longitude" 
                  value={currentLocation.longitude}
                  onChange={(e) => setCurrentLocation({...currentLocation, longitude: e.target.value})}
                  placeholder="e.g. -118.2437"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="note">Status Note (Optional)</Label>
              <Textarea 
                id="note" 
                value={locationNote}
                onChange={(e) => setLocationNote(e.target.value)}
                placeholder="e.g. Currently on I-405, estimated arrival in 20 minutes"
                className="min-h-[80px]"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setLocationDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={saveLocationUpdate}
              className="bg-collegeBites-blue hover:bg-collegeBites-darkBlue"
            >
              Update Location
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default DriverDashboard;
