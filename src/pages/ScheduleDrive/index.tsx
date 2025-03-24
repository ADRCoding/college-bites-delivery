
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, Car } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  fromLocation: z.string().min(3, { message: "Please enter a valid departure location" }),
  toLocation: z.string().min(3, { message: "Please enter a valid destination" }),
  departureDate: z.date({ required_error: "Please select a date" }),
  departureTime: z.string().min(1, { message: "Please enter a departure time" }),
  capacity: z.number().min(1).max(100).default(20),
});

type FormValues = z.infer<typeof formSchema>;

const ScheduleDrive = () => {
  const { user, userType } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if user is logged in and is a driver
  if (!user) {
    navigate('/login');
    return null;
  }

  if (userType !== 'driver') {
    navigate('/dashboard');
    return null;
  }

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fromLocation: "",
      toLocation: "",
      capacity: 20,
    },
  });

  const onSubmit = async (data: FormValues) => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      // Format the date for the database
      const formattedDate = format(data.departureDate, 'yyyy-MM-dd');

      // Insert drive schedule to Supabase
      const { data: newSchedule, error } = await supabase
        .from('driver_schedules')
        .insert({
          driver_id: user.id,
          from_location: data.fromLocation,
          to_location: data.toLocation,
          departure_date: formattedDate,
          departure_time: data.departureTime,
          capacity: data.capacity,
          available_capacity: data.capacity // Initially set to the same as capacity
        })
        .select()
        .single();

      if (error) throw error;

      toast.success("Drive scheduled successfully!");
      
      // Reset form
      form.reset();
      
      // Redirect to driver dashboard
      navigate('/driver-dashboard');
    } catch (error: any) {
      console.error("Error scheduling drive:", error);
      toast.error(`Failed to schedule drive: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-collegeBites-darkBlue">Schedule a Drive</h1>
            <p className="text-gray-600 mt-1">
              Create a new delivery route to help students get homemade meals
            </p>
          </div>
          
          <div className="bg-white shadow-md rounded-xl p-8 border border-gray-100">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="fromLocation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Departure Location</FormLabel>
                        <FormControl>
                          <Input placeholder="City, State" {...field} />
                        </FormControl>
                        <FormDescription>
                          Where are you driving from?
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="toLocation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Destination Campus</FormLabel>
                        <FormControl>
                          <Input placeholder="College Name, City" {...field} />
                        </FormControl>
                        <FormDescription>
                          Which campus are you delivering to?
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="departureDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Departure Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date < new Date()}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormDescription>
                          When will you depart?
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="departureTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Departure Time</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormDescription>
                          What time will you leave?
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="capacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meal Capacity</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min={1} 
                          max={100} 
                          {...field}
                          onChange={e => field.onChange(parseInt(e.target.value))} 
                        />
                      </FormControl>
                      <FormDescription>
                        How many meal packages can you transport? (Default: 20)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full md:w-auto bg-collegeBites-blue hover:bg-collegeBites-darkBlue flex gap-2 items-center"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Car size={18} />
                      Schedule Drive
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ScheduleDrive;
