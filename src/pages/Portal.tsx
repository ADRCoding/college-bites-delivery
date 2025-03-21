
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format, addDays, parseISO } from "date-fns";
import { toast } from "sonner";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Calendar,
  Clock,
  User,
  Check,
  Plus,
  Car,
  CreditCard,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

// Payment gateway component
const PaymentForm = ({ 
  scheduleId, 
  quantity, 
  description, 
  specialInstructions, 
  onSuccess, 
  onCancel 
}) => {
  const { user } = useAuth();
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [orderId, setOrderId] = useState("");

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-payment`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${supabase.auth.getSession().then(res => res.data.session?.access_token)}`,
          },
          body: JSON.stringify({
            scheduleId,
            quantity,
            description,
            specialInstructions,
            customerId: user?.id,
          }),
        });

        const data = await response.json();
        if (response.ok) {
          setClientSecret(data.clientSecret);
          setOrderId(data.orderId);
        } else {
          setError(data.error || "Failed to create payment");
          toast.error(data.error || "Failed to create payment");
        }
      } catch (err) {
        console.error("Error creating payment:", err);
        setError("Failed to connect to payment service. Please try again.");
        toast.error("Failed to connect to payment service. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (user && scheduleId && quantity > 0) {
      createPaymentIntent();
    }
  }, [scheduleId, quantity, description, specialInstructions, user]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      return;
    }

    setLoading(true);

    try {
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (stripeError) {
        setError(stripeError.message || "Payment failed. Please try again.");
        toast.error(stripeError.message || "Payment failed. Please try again.");
      } else if (paymentIntent.status === "succeeded") {
        // Confirm payment on our backend
        const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/confirm-payment`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${supabase.auth.getSession().then(res => res.data.session?.access_token)}`,
          },
          body: JSON.stringify({
            paymentIntentId: paymentIntent.id,
          }),
        });

        const data = await response.json();
        if (response.ok && data.success) {
          toast.success("Payment successful! Your booking is confirmed.");
          onSuccess();
        } else {
          setError(data.error || "Failed to confirm booking. Please contact support.");
          toast.error(data.error || "Failed to confirm booking. Please contact support.");
        }
      }
    } catch (err) {
      console.error("Error processing payment:", err);
      setError("An unexpected error occurred. Please try again.");
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="border p-4 rounded-md">
        <Label htmlFor="card-element" className="block mb-2 text-sm font-medium">Card Information</Label>
        <CardElement id="card-element" options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#424770',
              '::placeholder': {
                color: '#aab7c4',
              },
            },
            invalid: {
              color: '#9e2146',
            },
          },
        }} />
      </div>
      
      {error && <div className="text-red-500 text-sm">{error}</div>}
      
      <div className="flex justify-between mt-6">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          className="bg-collegeBites-blue hover:bg-collegeBites-darkBlue"
          disabled={loading || !clientSecret || !stripe}
        >
          {loading ? "Processing..." : "Pay & Confirm Booking"}
          <CreditCard className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </form>
  );
};

const Portal = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState("upcoming");
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [selectedDrive, setSelectedDrive] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  
  // Booking form state
  const [quantity, setQuantity] = useState(1);
  const [description, setDescription] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  
  // Schedule data state
  const [upcomingDrives, setUpcomingDrives] = useState([]);
  const [pastDrives, setPastDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // New drive form state
  const [newDriveOpen, setNewDriveOpen] = useState(false);
  const [newDriveDate, setNewDriveDate] = useState(undefined);
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [capacity, setCapacity] = useState("20");
  
  // Function to refresh schedule data
  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const today = new Date().toISOString();
      
      // Get upcoming schedules
      const { data: upcoming, error: upcomingError } = await supabase
        .from('driver_schedules')
        .select('*, auth.users!driver_schedules_driver_id_fkey(email)')
        .gte('departure_date', today.split('T')[0])
        .order('departure_date', { ascending: true });
      
      if (upcomingError) throw upcomingError;
      
      // Get past schedules
      const { data: past, error: pastError } = await supabase
        .from('driver_schedules')
        .select('*, auth.users!driver_schedules_driver_id_fkey(email)')
        .lt('departure_date', today.split('T')[0])
        .order('departure_date', { ascending: false });
      
      if (pastError) throw pastError;
      
      // Format the data for display
      const formattedUpcoming = upcoming.map(drive => ({
        id: drive.id,
        driver: drive.users.email.split('@')[0],
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
        driver: drive.users.email.split('@')[0],
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
  
  // Format time from database format
  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const time = new Date();
    time.setHours(parseInt(hours, 10));
    time.setMinutes(parseInt(minutes, 10));
    return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Load data on component mount
  useEffect(() => {
    if (user) {
      fetchSchedules();
    } else {
      navigate('/login');
    }
  }, [user, navigate]);
  
  const handleBookDrive = (drive) => {
    setSelectedDrive(drive);
    setQuantity(1);
    setDescription("");
    setSpecialInstructions("");
    setShowPayment(false);
    setBookingDialogOpen(true);
  };
  
  const proceedToPayment = () => {
    if (!quantity || quantity < 1 || quantity > selectedDrive.available) {
      toast.error(`Please enter a valid quantity between 1 and ${selectedDrive.available}`);
      return;
    }
    setShowPayment(true);
  };
  
  const handlePaymentSuccess = () => {
    setBookingDialogOpen(false);
    setSelectedDrive(null);
    setShowPayment(false);
    fetchSchedules(); // Refresh data
  };
  
  const handlePaymentCancel = () => {
    setShowPayment(false);
  };
  
  const handleAddNewDrive = async () => {
    if (!newDriveDate || !fromLocation || !toLocation || !departureTime || !capacity) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    try {
      // Convert date and time for database
      const formattedDate = format(newDriveDate, "yyyy-MM-dd");
      
      const { data, error } = await supabase
        .from('driver_schedules')
        .insert({
          driver_id: user.id,
          from_location: fromLocation,
          to_location: toLocation,
          departure_date: formattedDate,
          departure_time: departureTime,
          capacity: parseInt(capacity, 10),
          available_capacity: parseInt(capacity, 10),
        })
        .select();
      
      if (error) throw error;
      
      toast.success("New drive scheduled successfully!");
      setNewDriveOpen(false);
      
      // Reset form
      setNewDriveDate(undefined);
      setFromLocation("");
      setToLocation("");
      setDepartureTime("");
      setCapacity("20");
      
      // Refresh schedules
      fetchSchedules();
    } catch (error) {
      console.error("Error adding new drive:", error);
      toast.error(error.message || "Failed to schedule new drive");
    }
  };

  // Get current user role from localStorage
  const userRole = localStorage.getItem('userRole');
  const isDriver = userRole === 'driver';
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-collegeBites-darkBlue">Drive Portal</h1>
              <p className="text-gray-600 mt-1">
                Find and book parent drives to deliver homemade food
              </p>
            </div>
            <Button 
              variant="outline"
              className="flex gap-2 items-center"
              onClick={() => navigate('/dashboard')}
            >
              Back to Dashboard
            </Button>
          </div>

          <Tabs defaultValue="upcoming" className="space-y-4" onValueChange={setSelectedTab}>
            <div className="flex justify-between items-center">
              <TabsList>
                <TabsTrigger value="upcoming" className="relative px-8">
                  Upcoming Drives
                  {upcomingDrives.length > 0 && (
                    <span className="absolute right-2 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-collegeBites-blue text-[10px] text-white">
                      {upcomingDrives.length}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="past">Past Drives</TabsTrigger>
                <TabsTrigger value="calendar">Calendar View</TabsTrigger>
              </TabsList>
              
              {isDriver && (
                <Dialog open={newDriveOpen} onOpenChange={setNewDriveOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-collegeBites-blue hover:bg-collegeBites-darkBlue">
                      <Plus className="mr-2 h-4 w-4" />
                      Add New Drive
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Schedule a New Drive</DialogTitle>
                      <DialogDescription>
                        Enter the details of your trip to help other parents deliver food to students
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="date">Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              id="date"
                              variant={"outline"}
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !newDriveDate && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {newDriveDate ? format(newDriveDate, "PPP") : <span>Select date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <CalendarComponent
                              mode="single"
                              selected={newDriveDate}
                              onSelect={setNewDriveDate}
                              initialFocus
                              disabled={(date) => date < addDays(new Date(), 1)}
                              className={cn("p-3 pointer-events-auto")}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="from">From (City)</Label>
                        <Input 
                          id="from" 
                          value={fromLocation} 
                          onChange={(e) => setFromLocation(e.target.value)} 
                          placeholder="e.g. Los Angeles"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="to">To (College/University)</Label>
                        <Input 
                          id="to" 
                          value={toLocation} 
                          onChange={(e) => setToLocation(e.target.value)} 
                          placeholder="e.g. UCLA"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="time">Departure Time</Label>
                        <Input 
                          id="time" 
                          type="time" 
                          value={departureTime} 
                          onChange={(e) => setDepartureTime(e.target.value)}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="capacity">Available Capacity for Packages</Label>
                        <Input 
                          id="capacity" 
                          type="number" 
                          min="1" 
                          max="50" 
                          value={capacity} 
                          onChange={(e) => setCapacity(e.target.value)}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setNewDriveOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddNewDrive} className="bg-collegeBites-blue hover:bg-collegeBites-darkBlue">
                        Schedule Drive
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>
            
            <TabsContent value="upcoming" className="space-y-4">
              <div className="bg-white shadow rounded-lg overflow-hidden">
                {loading ? (
                  <div className="p-8 text-center">
                    <p>Loading available drives...</p>
                  </div>
                ) : upcomingDrives.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Driver</TableHead>
                        <TableHead>Route</TableHead>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Availability</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {upcomingDrives.map((drive) => (
                        <TableRow key={drive.id}>
                          <TableCell className="font-medium">{drive.driver}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                              {drive.from} to {drive.to}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                                {format(drive.date, "PP")}
                              </div>
                              <div className="flex items-center mt-1">
                                <Clock className="h-4 w-4 mr-1 text-gray-500" />
                                {drive.time}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <User className="h-4 w-4 mr-1 text-gray-500" />
                              {drive.available} of {drive.capacity} spots left
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              onClick={() => handleBookDrive(drive)} 
                              disabled={drive.available === 0 || drive.driverId === user?.id}
                              className="bg-collegeBites-blue hover:bg-collegeBites-darkBlue"
                            >
                              {drive.driverId === user?.id ? "Your Drive" : "Book"}
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
                      There are no upcoming drives scheduled at the moment.
                    </p>
                    {isDriver && (
                      <div className="mt-6">
                        <Button 
                          onClick={() => setNewDriveOpen(true)}
                          className="bg-collegeBites-blue hover:bg-collegeBites-darkBlue"
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add New Drive
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="past" className="space-y-4">
              <div className="bg-white shadow rounded-lg overflow-hidden">
                {loading ? (
                  <div className="p-8 text-center">
                    <p>Loading past drives...</p>
                  </div>
                ) : pastDrives.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Driver</TableHead>
                        <TableHead>Route</TableHead>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Packages Delivered</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pastDrives.map((drive) => (
                        <TableRow key={drive.id}>
                          <TableCell className="font-medium">{drive.driver}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                              {drive.from} to {drive.to}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                                {format(drive.date, "PP")}
                              </div>
                              <div className="flex items-center mt-1">
                                <Clock className="h-4 w-4 mr-1 text-gray-500" />
                                {drive.time}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <User className="h-4 w-4 mr-1 text-gray-500" />
                              {drive.capacity - drive.available} of {drive.capacity}
                            </div>
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
                      You haven't participated in any drives yet.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="calendar" className="space-y-4">
              <div className="bg-white p-4 shadow rounded-lg">
                <div className="flex flex-col space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold">Available Drives by Date</h2>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="icon">
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <span className="text-sm font-medium">
                        {format(new Date(), "MMMM yyyy")}
                      </span>
                      <Button variant="outline" size="icon">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-7 gap-2 text-center text-xs">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                      <div key={day} className="py-2 font-medium">{day}</div>
                    ))}
                    
                    {/* Generate calendar days */}
                    {Array.from(
                      { length: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate() }, 
                      (_, i) => i + 1
                    ).map((day) => {
                      const currentDate = new Date(new Date().getFullYear(), new Date().getMonth(), day);
                      const hasDrive = upcomingDrives.some(
                        drive => drive.date.getDate() === day && 
                                drive.date.getMonth() === currentDate.getMonth()
                      );
                      
                      return (
                        <div 
                          key={day} 
                          className={cn(
                            "aspect-square flex flex-col items-center justify-start p-2 rounded-md border text-sm",
                            hasDrive ? "bg-blue-50 border-blue-200" : "bg-white border-gray-200",
                            day === new Date().getDate() && "ring-2 ring-collegeBites-blue"
                          )}
                        >
                          <span className="font-medium mb-1">{day}</span>
                          {hasDrive && (
                            <div className="w-2 h-2 rounded-full bg-collegeBites-blue mt-auto mb-1"></div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="border-t pt-4 mt-2">
                    <h3 className="font-medium text-sm mb-2">Upcoming Drives:</h3>
                    <div className="space-y-2">
                      {upcomingDrives.slice(0, 3).map((drive) => (
                        <div key={drive.id} className="flex justify-between items-center p-2 border rounded-md bg-gray-50">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-collegeBites-blue" />
                            <span className="text-sm">{format(drive.date, "PP")} ({drive.time})</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-gray-500">{drive.from} → {drive.to}</span>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-collegeBites-blue hover:text-collegeBites-darkBlue"
                              onClick={() => handleBookDrive(drive)}
                              disabled={drive.available === 0 || drive.driverId === user?.id}
                            >
                              {drive.driverId === user?.id ? "Your Drive" : "Book"}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Dialog open={bookingDialogOpen} onOpenChange={setBookingDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {showPayment ? "Payment Details" : "Book a Delivery Spot"}
            </DialogTitle>
            <DialogDescription>
              {showPayment 
                ? "Complete your payment to confirm booking" 
                : "Confirm your booking details for food delivery"
              }
            </DialogDescription>
          </DialogHeader>
          
          {selectedDrive && !showPayment && (
            <div className="space-y-4 py-4">
              <div className="space-y-1">
                <h4 className="font-medium text-sm">Driver</h4>
                <p className="text-sm">{selectedDrive.driver}</p>
              </div>
              <div className="space-y-1">
                <h4 className="font-medium text-sm">Trip Details</h4>
                <p className="text-sm">From {selectedDrive.from} to {selectedDrive.to}</p>
                <p className="text-sm">
                  {format(selectedDrive.date, "PPP")} at {selectedDrive.time}
                </p>
              </div>
              <div className="space-y-1">
                <h4 className="font-medium text-sm">Number of Food Boxes</h4>
                <Input 
                  type="number" 
                  min="1" 
                  max={selectedDrive.available} 
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
                />
                <p className="text-xs text-gray-500">
                  Price: ${quantity * 10.00} (${10.00} per box)
                </p>
              </div>
              <div className="space-y-1">
                <h4 className="font-medium text-sm">Package Description</h4>
                <Input 
                  placeholder="Describe your food package" 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <h4 className="font-medium text-sm">Special Instructions</h4>
                <Input 
                  placeholder="Any dietary or handling instructions" 
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                />
              </div>
            </div>
          )}
          
          {selectedDrive && showPayment && (
            <PaymentForm
              scheduleId={selectedDrive.id}
              quantity={quantity}
              description={description}
              specialInstructions={specialInstructions}
              onSuccess={handlePaymentSuccess}
              onCancel={handlePaymentCancel}
            />
          )}
          
          {selectedDrive && !showPayment && (
            <DialogFooter>
              <Button variant="outline" onClick={() => setBookingDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={proceedToPayment} className="bg-collegeBites-blue hover:bg-collegeBites-darkBlue">
                <CreditCard className="mr-2 h-4 w-4" /> Proceed to Payment
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default Portal;
