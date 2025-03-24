
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Car, Package, Calendar, Info, Clock, MapPin, RefreshCw, User } from "lucide-react";

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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { formatTime } from "@/utils/formatTime";

const Portal = () => {
  const navigate = useNavigate();
  const { user, userType } = useAuth();
  const [driverSchedules, setDriverSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [description, setDescription] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [driverDetails, setDriverDetails] = useState({});
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (userType === 'driver') {
      navigate('/schedule-drive');
    }
  }, [userType, navigate]);

  useEffect(() => {
    fetchDriverSchedules();
  }, []);

  const fetchDriverSchedules = async () => {
    try {
      setLoading(true);
      
      const { data: schedules, error } = await supabase
        .from('driver_schedules')
        .select('*, user_profiles(name, email)')
        .gt('available_capacity', 0)
        .order('departure_date', { ascending: true });
      
      if (error) throw error;
      
      setDriverSchedules(schedules || []);
      
      const driverIds = [...new Set(schedules.map(schedule => schedule.driver_id))];
      
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('id, name, email')
        .in('id', driverIds);
        
      if (profileError) throw profileError;
      
      const driverMap = {};
      profileData?.forEach(profile => {
        driverMap[profile.id] = profile;
      });
      
      setDriverDetails(driverMap);
    } catch (error) {
      console.error("Error fetching driver schedules:", error);
      toast.error("Failed to load driver schedules");
    } finally {
      setLoading(false);
    }
  };

  const handleOrderClick = (schedule) => {
    setSelectedSchedule(schedule);
    setOrderDialogOpen(true);
  };

  const handlePlaceOrder = async () => {
    if (!user || !selectedSchedule) return;
    
    if (quantity > selectedSchedule.available_capacity) {
      toast.error(`Sorry, only ${selectedSchedule.available_capacity} slots available`);
      return;
    }
    
    if (quantity < 1) {
      toast.error("Please order at least 1 meal");
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_id: user.id,
          schedule_id: selectedSchedule.id,
          quantity: quantity,
          description: description,
          special_instructions: specialInstructions,
          status: 'pending'
        })
        .select()
        .single();
      
      if (orderError) throw orderError;
      
      const { error: updateError } = await supabase.rpc(
        'decrease_capacity',
        { 
          schedule_id: selectedSchedule.id,
          quantity_requested: quantity
        }
      );
      
      if (updateError) throw updateError;
      
      toast.success("Order placed successfully!");
      
      setOrderDialogOpen(false);
      setSelectedSchedule(null);
      setQuantity(1);
      setDescription("");
      setSpecialInstructions("");
      
      fetchDriverSchedules();
      
      navigate('/dashboard');
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error(`Failed to place order: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  const getDriverName = (driverId) => {
    return driverDetails[driverId]?.name || "Driver";
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-collegeBites-darkBlue">
              {userType === 'driver' ? 'Schedule a Drive' : 'Find Available Deliveries'}
            </h1>
            <p className="text-gray-600 mt-1">
              {userType === 'driver' 
                ? 'Schedule a new delivery route to help students get homemade food' 
                : 'Browse available drivers and schedule a delivery for homemade food'}
            </p>
          </div>

          {userType === 'driver' ? (
            <Card>
              <CardHeader>
                <CardTitle>Schedule a Delivery Route</CardTitle>
                <CardDescription>Set up your delivery schedule to help students get homemade meals</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center py-6">
                <Button 
                  size="lg" 
                  className="bg-collegeBites-blue hover:bg-collegeBites-darkBlue flex gap-2 items-center"
                  onClick={() => navigate('/schedule-drive')}
                >
                  <Car size={20} />
                  Schedule a New Drive
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Available Delivery Routes</h2>
                <Button 
                  variant="outline" 
                  onClick={fetchDriverSchedules}
                  className="flex gap-2 items-center"
                >
                  <RefreshCw size={16} />
                  Refresh
                </Button>
              </div>
              
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-collegeBites-blue mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading available drivers...</p>
                </div>
              ) : driverSchedules.length > 0 ? (
                <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {driverSchedules.map((schedule) => (
                    <Card key={schedule.id} className="overflow-hidden">
                      <CardHeader className="bg-gray-50 px-6 py-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{schedule.from_location} to {schedule.to_location}</CardTitle>
                            <CardDescription className="mt-1">
                              <div className="flex items-center text-sm">
                                <Calendar className="h-4 w-4 mr-1" />
                                {formatDate(schedule.departure_date)}
                                <Clock className="h-4 w-4 ml-3 mr-1" />
                                {formatTime(schedule.departure_time)}
                              </div>
                            </CardDescription>
                          </div>
                          <Badge variant="outline" className="bg-collegeBites-blue/10 text-collegeBites-blue border-collegeBites-blue">
                            {schedule.available_capacity} slots left
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="space-y-3">
                          <div className="flex items-start">
                            <MapPin className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                            <div>
                              <p className="font-medium">Route</p>
                              <p className="text-sm text-gray-600">{schedule.from_location} → {schedule.to_location}</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <User className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                            <div>
                              <p className="font-medium">Driver</p>
                              <p className="text-sm text-gray-600">{getDriverName(schedule.driver_id)}</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <Package className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                            <div>
                              <p className="font-medium">Capacity</p>
                              <p className="text-sm text-gray-600">{schedule.available_capacity} of {schedule.capacity} slots available</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="px-6 py-4 bg-gray-50 flex justify-between">
                        <Button 
                          variant="outline"
                          size="sm"
                          onClick={() => toast.info(`Driving from ${schedule.from_location} to ${schedule.to_location} on ${formatDate(schedule.departure_date)} at ${formatTime(schedule.departure_time)}`)}
                          className="flex gap-1 items-center"
                        >
                          <Info size={16} />
                          Details
                        </Button>
                        <Button 
                          size="sm"
                          className="bg-collegeBites-blue hover:bg-collegeBites-darkBlue flex gap-1 items-center"
                          onClick={() => handleOrderClick(schedule)}
                        >
                          <Package size={16} />
                          Order Delivery
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                  <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100">
                    <Car className="h-8 w-8 text-gray-500" />
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">No drivers available</h3>
                  <p className="mt-2 text-gray-500">
                    There are no scheduled deliveries available at the moment.
                    <br />
                    Please check back later.
                  </p>
                </div>
              )}
              
              <Dialog open={orderDialogOpen} onOpenChange={setOrderDialogOpen}>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Place a Delivery Order</DialogTitle>
                    <DialogDescription>
                      {selectedSchedule && (
                        <>Route: {selectedSchedule.from_location} to {selectedSchedule.to_location}</>
                      )}
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 py-2">
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Number of Meals</Label>
                      <Input
                        id="quantity"
                        type="number"
                        min="1"
                        max={selectedSchedule?.available_capacity || 1}
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                      />
                      {selectedSchedule && (
                        <p className="text-sm text-gray-500">
                          Maximum available: {selectedSchedule.available_capacity}
                        </p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Food Description</Label>
                      <Input
                        id="description"
                        placeholder="Homemade lasagna, cookies, etc."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="special-instructions">Special Instructions</Label>
                      <Textarea
                        id="special-instructions"
                        placeholder="Any notes for the driver..."
                        value={specialInstructions}
                        onChange={(e) => setSpecialInstructions(e.target.value)}
                        rows={3}
                      />
                    </div>
                  </div>
                  
                  <DialogFooter className="sm:justify-between">
                    <Button
                      variant="outline"
                      onClick={() => setOrderDialogOpen(false)}
                      disabled={isProcessing}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handlePlaceOrder}
                      disabled={isProcessing}
                      className="bg-collegeBites-blue hover:bg-collegeBites-darkBlue"
                    >
                      {isProcessing ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      ) : (
                        "Place Order"
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Portal;
