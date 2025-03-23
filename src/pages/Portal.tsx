
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import {
  Car,
  CalendarDays,
  Clock,
  MapPin,
  ArrowRightLeft,
  Package,
  Minus,
  Plus,
  ShoppingCart,
} from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { formatTime } from "@/utils/formatTime";
import Checkout from "@/components/Checkout";

const formSchema = z.object({
  description: z.string().min(2, {
    message: "Description must be at least 2 characters.",
  }),
  special_instructions: z.string().optional(),
  schedule_id: z.string({
    required_error: "Please select a delivery schedule.",
  }),
});

const Portal = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedSchedule, setSelectedSchedule] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      special_instructions: "",
      schedule_id: "",
    },
  });

  if (!user) {
    navigate('/login');
    return null;
  }

  const { data: schedules, isLoading, error } = useQuery({
    queryKey: ['driverSchedules'],
    queryFn: async () => {
      const { data: scheduleData, error } = await supabase
        .from('driver_schedules')
        .select('*')
        .gte('departure_date', new Date().toISOString().split('T')[0])
        .order('departure_date', { ascending: true });
      
      if (error) throw error;
      
      const schedulesWithDrivers = await Promise.all(
        (scheduleData || []).map(async (schedule) => {
          const { data: userData, error: userError } = await supabase
            .from('user_profiles')
            .select('email')
            .eq('id', schedule.driver_id)
            .single();
          
          const driverEmail = userError ? 'driver@example.com' : userData?.email || 'driver@example.com';
          
          return {
            ...schedule,
            driver_email: driverEmail,
          };
        })
      );
      
      return schedulesWithDrivers;
    },
  });

  const handleScheduleChange = (scheduleId: string) => {
    const schedule = schedules?.find(s => s.id === scheduleId);
    if (schedule) {
      setSelectedSchedule(schedule);
      // Reset quantity when schedule changes
      setQuantity(1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    if (selectedSchedule && quantity < selectedSchedule.available_capacity) {
      setQuantity(quantity + 1);
    } else {
      toast.error("Cannot exceed available capacity");
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!selectedSchedule) {
      toast.error("Please select a delivery schedule");
      return;
    }
    
    if (quantity > selectedSchedule.available_capacity) {
      toast.error(`Only ${selectedSchedule.available_capacity} spots available`);
      return;
    }

    setIsCheckoutOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-collegeBites-darkBlue">Order Food Delivery</h1>
            <p className="text-gray-600 mt-1">
              Schedule a food delivery from home to your college student
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Delivery Details</CardTitle>
                  <CardDescription>
                    Tell us about the food you want to send
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Food Description</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Describe the food you're sending (e.g., Homemade lasagna, cookies, etc.)"
                                className="resize-none"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Be specific about the types of food being sent.
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
                                placeholder="Any special handling instructions or notes for the driver"
                                className="resize-none"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Include any allergies, storage instructions, or delivery notes.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="schedule_id"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Select Delivery Schedule</FormLabel>
                            <Select 
                              onValueChange={(value) => {
                                field.onChange(value);
                                handleScheduleChange(value);
                              }}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a delivery schedule" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {isLoading ? (
                                  <SelectItem value="loading" disabled>Loading schedules...</SelectItem>
                                ) : error ? (
                                  <SelectItem value="error" disabled>Error loading schedules</SelectItem>
                                ) : schedules && schedules.length > 0 ? (
                                  schedules.map((schedule) => (
                                    <SelectItem key={schedule.id} value={schedule.id}>
                                      {schedule.from_location} to {schedule.to_location} - {new Date(schedule.departure_date).toLocaleDateString()} at {formatTime(schedule.departure_time)}
                                    </SelectItem>
                                  ))
                                ) : (
                                  <SelectItem value="none" disabled>No schedules available</SelectItem>
                                )}
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Choose from available delivery schedules.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {selectedSchedule && (
                        <div className="mt-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <h3 className="font-medium text-gray-900 mb-2">Selected Delivery Details</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center">
                              <ArrowRightLeft className="h-5 w-5 text-gray-500 mr-2" />
                              <div>
                                <p className="text-sm font-medium">Route</p>
                                <p className="text-sm text-gray-600">{selectedSchedule.from_location} to {selectedSchedule.to_location}</p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <CalendarDays className="h-5 w-5 text-gray-500 mr-2" />
                              <div>
                                <p className="text-sm font-medium">Date</p>
                                <p className="text-sm text-gray-600">{new Date(selectedSchedule.departure_date).toLocaleDateString()}</p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-5 w-5 text-gray-500 mr-2" />
                              <div>
                                <p className="text-sm font-medium">Departure Time</p>
                                <p className="text-sm text-gray-600">{formatTime(selectedSchedule.departure_time)}</p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <Car className="h-5 w-5 text-gray-500 mr-2" />
                              <div>
                                <p className="text-sm font-medium">Driver</p>
                                <p className="text-sm text-gray-600">{selectedSchedule.driver_email}</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-4">
                            <p className="text-sm font-medium mb-2">Quantity</p>
                            <div className="flex items-center">
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={decreaseQuantity}
                                disabled={quantity <= 1}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="mx-4 text-lg font-medium">{quantity}</span>
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={increaseQuantity}
                                disabled={!selectedSchedule || quantity >= selectedSchedule.available_capacity}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                              <span className="ml-4 text-sm text-gray-500">
                                {selectedSchedule.available_capacity} spots available
                              </span>
                            </div>
                          </div>
                          
                          <div className="mt-4">
                            <Separator className="my-4" />
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="text-sm text-gray-500">Cost Per Item</p>
                                <p className="text-lg font-bold">$10.00</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Total Cost</p>
                                <p className="text-lg font-bold">${(quantity * 10).toFixed(2)}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <Button 
                        type="submit" 
                        className="w-full bg-collegeBites-blue hover:bg-collegeBites-darkBlue"
                        disabled={isLoading || !selectedSchedule}
                      >
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Proceed to Checkout
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
            
            <div className="md:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>How It Works</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-collegeBites-blue flex items-center justify-center text-white">
                        1
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm font-medium">Select a Route</h3>
                        <p className="text-sm text-gray-500">Choose from available driver routes and schedules.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-collegeBites-blue flex items-center justify-center text-white">
                        2
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm font-medium">Provide Details</h3>
                        <p className="text-sm text-gray-500">Tell us about the food and any special instructions.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-collegeBites-blue flex items-center justify-center text-white">
                        3
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm font-medium">Pay Securely</h3>
                        <p className="text-sm text-gray-500">Complete your order with our secure payment system.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-collegeBites-blue flex items-center justify-center text-white">
                        4
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm font-medium">Track Delivery</h3>
                        <p className="text-sm text-gray-500">Follow your delivery in real-time until it arrives.</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <p className="text-xs text-gray-500">
                    Our drivers ensure safe and on-time delivery of your homemade food packages to your loved ones.
                  </p>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      {isCheckoutOpen && selectedSchedule && (
        <Checkout
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          schedule={selectedSchedule}
          description={form.getValues().description}
          specialInstructions={form.getValues().special_instructions}
          quantity={quantity}
          customerId={user.id}
        />
      )}

      <Footer />
    </div>
  );
};

export default Portal;
