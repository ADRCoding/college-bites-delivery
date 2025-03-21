
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { LogOut, Users, Car, Package, User, UtensilsCrossed, Map } from "lucide-react";

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
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, signOut, userType } = useAuth();
  const [orders, setOrders] = useState([]);
  const [upcomingDeliveries, setUpcomingDeliveries] = useState(0);
  const [completedDeliveries, setCompletedDeliveries] = useState(0);
  const [loading, setLoading] = useState(true);

  // Check if user is a customer or parent
  useEffect(() => {
    if (userType === 'driver') {
      navigate('/driver-dashboard');
    }
  }, [userType, navigate]);

  // Fetch orders for this customer
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    fetchCustomerOrders();
  }, [user, navigate]);

  const fetchCustomerOrders = async () => {
    try {
      setLoading(true);
      
      // Get customer orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          *,
          driver_schedules(*)
        `)
        .eq('customer_id', user.id)
        .order('created_at', { ascending: false });
      
      if (ordersError) throw ordersError;
      
      // Process orders
      const pending = ordersData?.filter(order => 
        order.status === 'pending' || order.status === 'in_transit'
      ).length || 0;
      
      const completed = ordersData?.filter(order => 
        order.status === 'completed'
      ).length || 0;
      
      setOrders(ordersData || []);
      setUpcomingDeliveries(pending);
      setCompletedDeliveries(completed);
    } catch (error) {
      console.error("Error fetching customer orders:", error);
      toast.error("Failed to load your orders");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
  };

  const goToPortal = () => {
    navigate("/portal");
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
              <h1 className="text-3xl font-bold text-collegeBites-darkBlue">Customer Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Welcome to your food delivery dashboard
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Deliveries</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{upcomingDeliveries}</div>
                <p className="text-xs text-muted-foreground">{upcomingDeliveries} deliveries in process</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed Deliveries</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{completedDeliveries}</div>
                <p className="text-xs text-muted-foreground">Successfully delivered packages</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Available Drivers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Browse</div>
                <p className="text-xs text-muted-foreground">See available delivery options</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="orders" className="mt-8 space-y-6">
            <TabsList>
              <TabsTrigger value="orders">Your Orders</TabsTrigger>
              <TabsTrigger value="scheduled">Delivery Calendar</TabsTrigger>
            </TabsList>
            
            <TabsContent value="orders" className="space-y-4">
              <div className="bg-white rounded-lg shadow overflow-hidden">
                {loading ? (
                  <div className="p-8 text-center">
                    <p>Loading your orders...</p>
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
                            {order.driver_schedules?.from_location} to {order.driver_schedules?.to_location}
                          </TableCell>
                          <TableCell>
                            {order.driver_schedules?.departure_date ? new Date(order.driver_schedules.departure_date).toLocaleDateString() : "N/A"}
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
                            <Link to={`/track/${order.id}`}>
                              <Button 
                                size="sm" 
                                className="bg-collegeBites-blue hover:bg-collegeBites-darkBlue flex items-center gap-1"
                              >
                                <Map className="h-4 w-4" />
                                Track
                              </Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="p-8 text-center">
                    <Package className="h-12 w-12 mx-auto text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No orders yet</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      You haven't placed any food delivery orders yet.
                    </p>
                    <div className="mt-6">
                      <Button 
                        onClick={() => navigate('/portal')}
                        className="bg-collegeBites-blue hover:bg-collegeBites-darkBlue"
                      >
                        Browse Available Deliveries
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="scheduled" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Delivery Calendar</CardTitle>
                  <CardDescription>View your upcoming food deliveries</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="p-4 text-center">
                    <Car className="h-12 w-12 mx-auto text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">Schedule a Delivery</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Browse available drivers and schedule a delivery for your homemade food.
                    </p>
                    <Button 
                      className="mt-4 bg-collegeBites-blue hover:bg-collegeBites-darkBlue"
                      onClick={goToPortal}
                    >
                      Find Available Drivers
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>My Food Preferences</CardTitle>
                  <CardDescription>Update your food preferences for future deliveries</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <UtensilsCrossed className="h-5 w-5 text-collegeBites-blue mb-2" />
                      <h4 className="font-medium">Dietary Restrictions</h4>
                      <p className="text-sm text-gray-600 mt-1">Update any dietary restrictions or allergies</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <Package className="h-5 w-5 text-collegeBites-blue mb-2" />
                      <h4 className="font-medium">Packaging Preferences</h4>
                      <p className="text-sm text-gray-600 mt-1">Set your preferences for food packaging</p>
                    </div>
                  </div>
                  <Button className="w-full mt-4" variant="outline">
                    Update Preferences
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
