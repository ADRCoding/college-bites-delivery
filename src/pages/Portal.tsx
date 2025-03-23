
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { 
  Truck, 
  Calendar, 
  Clock, 
  Package, 
  Navigation, 
  ArrowLeft,
  PlusCircle,
  MinusCircle
} from "lucide-react";
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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQuery } from "@tanstack/react-query";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { formatTime } from "@/pages/DriverDashboard/utils/formatTime";
import Checkout from "@/components/Checkout";

// Form schema
const formSchema = z.object({
  description: z.string().min(2, {
    message: "Description must be at least 2 characters.",
  }),
  quantity: z.number().min(1, {
    message: "You must order at least 1 item.",
  }).max(10, {
    message: "Maximum 10 items per order.",
  }),
  special_instructions: z.string().optional(),
});

const Portal = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  
  // Form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "Food Package",
      quantity: 1,
      special_instructions: "",
    },
  });

  // Redirect to login if not authenticated
  if (!user) {
    navigate('/login');
    return null;
  }

  // Fetch available schedules
  const { data: schedules, isLoading, error } = useQuery({
    queryKey: ['driverSchedules'],
    queryFn: async () => {
      // Update the query to use a simpler approach without join
      const { data: scheduleData, error } = await supabase
        .from('driver_schedules')
        .select('*')
        .gt('available_capacity', 0)
        .order('departure_date', { ascending: true });
      
      if (error) throw error;
      
      // For each schedule, fetch the driver details separately
      const schedulesWithDrivers = await Promise.all(
        (scheduleData || []).map(async (schedule) => {
          const { data: userData, error: userError } = await supabase
            .from('user_profiles') // This is a table you'd need to create
            .select('email')
            .eq('id', schedule.driver_id)
            .single();
          
          // If we can't get the driver details, use a placeholder
          const driverEmail = userError ? 'driver@example.com' : userData?.email || 'driver@example.com';
          
          return {
            ...schedule,
            driver: { email: driverEmail }
          };
        })
      );
      
      return schedulesWithDrivers || [];
    }
  });

  const handleScheduleSelect = (schedule) => {
    setSelectedSchedule(schedule);
    form.setValue("quantity", 1);
    setQuantity(1);
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) newQuantity = 1;
    if (selectedSchedule && newQuantity > selectedSchedule.available_capacity) {
      newQuantity = selectedSchedule.available_capacity;
    }
    if (newQuantity > 10) newQuantity = 10;
    
    setQuantity(newQuantity);
    form.setValue("quantity", newQuantity);
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!selectedSchedule) {
      toast({
        title: "Error",
        description: "Please select a delivery schedule",
        variant: "destructive",
      });
      return;
    }

    if (values.quantity > selectedSchedule.available_capacity) {
      toast({
        title: "Error",
        description: `Only ${selectedSchedule.available_capacity} spots available for this delivery`,
        variant: "destructive",
      });
      return;
    }

    // Open checkout dialog
    setIsCheckoutOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <Button 
              variant="ghost" 
              className="mb-4 flex items-center text-gray-600"
              onClick={() => navigate('/dashboard')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
            
            <h1 className="text-3xl font-bold text-collegeBites-darkBlue">Food Delivery Portal</h1>
            <p className="text-gray-600 mt-1">
              Find drivers to deliver food packages between college campuses
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              <h2 className="text-xl font-semibold">Available Delivery Routes</h2>
              
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-collegeBites-blue mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading available routes...</p>
                </div>
              ) : error ? (
                <div className="bg-red-50 p-4 rounded-md text-red-500">
                  Error loading schedules. Please try again.
                </div>
              ) : schedules?.length === 0 ? (
                <div className="bg-yellow-50 p-6 rounded-lg text-center">
                  <Package className="h-12 w-12 mx-auto text-yellow-500 mb-3" />
                  <h3 className="text-lg font-medium">No deliveries available</h3>
                  <p className="text-gray-600 mt-2">
                    There are no scheduled deliveries at this time. Please check back later.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {schedules?.map((schedule) => (
                    <Card 
                      key={schedule.id}
                      className={`cursor-pointer transition-all ${
                        selectedSchedule?.id === schedule.id 
                          ? 'ring-2 ring-collegeBites-blue' 
                          : 'hover:shadow-md'
                      }`}
                      onClick={() => handleScheduleSelect(schedule)}
                    >
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center text-lg font-medium mb-1">
                              <Navigation className="h-5 w-5 mr-2 text-collegeBites-blue" />
                              {schedule.from_location} to {schedule.to_location}
                            </div>
                            
                            <div className="flex items-center text-gray-600 mb-3">
                              <Calendar className="h-4 w-4 mr-1" />
                              <span className="mr-3">
                                {new Date(schedule.departure_date).toLocaleDateString()}
                              </span>
                              
                              <Clock className="h-4 w-4 mr-1" />
                              <span>{formatTime(schedule.departure_time)}</span>
                            </div>
                            
                            <div className="text-sm text-gray-600">
                              <p className="flex items-center">
                                <Truck className="h-4 w-4 mr-1 text-collegeBites-darkBlue" />
                                Driver: {schedule.driver.email.split('@')[0]}
                              </p>
                              <p className="flex items-center mt-1">
                                <Package className="h-4 w-4 mr-1 text-collegeBites-darkBlue" />
                                Available space: {schedule.available_capacity} spots
                              </p>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                              $10 per spot
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Place Your Order</CardTitle>
                  <CardDescription>
                    Complete the form to schedule a food package delivery
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!selectedSchedule ? (
                    <div className="text-center py-8">
                      <Truck className="h-12 w-12 mx-auto text-gray-400" />
                      <p className="mt-4 text-gray-600">
                        Select a delivery route from the list to place your order
                      </p>
                    </div>
                  ) : (
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="bg-gray-50 p-4 rounded-md mb-4">
                          <h3 className="font-medium">Selected Route</h3>
                          <p className="text-sm text-gray-600">
                            {selectedSchedule.from_location} to {selectedSchedule.to_location}
                          </p>
                          <p className="text-sm text-gray-600">
                            {new Date(selectedSchedule.departure_date).toLocaleDateString()} at {formatTime(selectedSchedule.departure_time)}
                          </p>
                        </div>
                        
                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Package Description</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Food package" />
                              </FormControl>
                              <FormDescription>
                                Describe what you're sending.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="quantity"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Quantity</FormLabel>
                              <div className="flex items-center space-x-3">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  onClick={() => handleQuantityChange(quantity - 1)}
                                >
                                  <MinusCircle className="h-4 w-4" />
                                </Button>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    {...field}
                                    value={quantity}
                                    onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                                    min={1}
                                    max={selectedSchedule.available_capacity > 10 ? 10 : selectedSchedule.available_capacity}
                                    className="w-16 text-center"
                                  />
                                </FormControl>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  onClick={() => handleQuantityChange(quantity + 1)}
                                >
                                  <PlusCircle className="h-4 w-4" />
                                </Button>
                                <span className="text-sm text-gray-500">
                                  (Max: {selectedSchedule.available_capacity > 10 ? 10 : selectedSchedule.available_capacity})
                                </span>
                              </div>
                              <FormDescription>
                                Number of food packages to send.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="special_instructions"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Special Instructions (Optional)</FormLabel>
                              <FormControl>
                                <Textarea
                                  {...field}
                                  placeholder="Any special handling instructions..."
                                  className="min-h-[80px]"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="bg-blue-50 p-4 rounded-md">
                          <h3 className="font-medium flex items-center">
                            <Package className="h-4 w-4 mr-2 text-collegeBites-blue" />
                            Order Summary
                          </h3>
                          <div className="mt-2 space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span>Food Package:</span>
                              <span>${10} x {quantity}</span>
                            </div>
                            <div className="flex justify-between font-medium border-t border-blue-100 pt-1 mt-1">
                              <span>Total:</span>
                              <span>${10 * quantity}</span>
                            </div>
                          </div>
                        </div>
                        
                        <Button 
                          type="submit"
                          className="w-full bg-collegeBites-blue hover:bg-collegeBites-darkBlue"
                        >
                          Proceed to Payment
                        </Button>
                      </form>
                    </Form>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      {/* Checkout Dialog */}
      {isCheckoutOpen && selectedSchedule && (
        <Checkout
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          schedule={selectedSchedule}
          quantity={quantity}
          description={form.getValues().description}
          specialInstructions={form.getValues().special_instructions}
        />
      )}
      
      <Footer />
    </div>
  );
};

export default Portal;
