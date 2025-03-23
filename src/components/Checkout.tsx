
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  CreditCard, 
  Calendar, 
  User, 
  Lock, 
  X 
} from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { formatTime } from "@/utils/formatTime";

const paymentFormSchema = z.object({
  cardHolder: z.string().min(3, { message: "Cardholder name is required" }),
  cardNumber: z.string()
    .min(16, { message: "Card number must be at least 16 digits" })
    .max(19, { message: "Card number must be at most 19 digits" })
    .regex(/^[0-9]+$/, { message: "Card number must contain only digits" }),
  expiryDate: z.string()
    .regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, { message: "Expiry date must be in MM/YY format" }),
  cvv: z.string()
    .length(3, { message: "CVV must be 3 digits" })
    .regex(/^[0-9]+$/, { message: "CVV must contain only digits" }),
});

type CheckoutProps = {
  isOpen: boolean;
  onClose: () => void;
  schedule: any;
  description: string;
  specialInstructions?: string;
  quantity: number;
  customerId: string;
};

const Checkout = ({
  isOpen,
  onClose,
  schedule,
  description,
  specialInstructions,
  quantity,
  customerId,
}: CheckoutProps) => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const form = useForm<z.infer<typeof paymentFormSchema>>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      cardHolder: "",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof paymentFormSchema>) => {
    try {
      setIsProcessing(true);
      
      // Call the edge function to create a payment
      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: {
          scheduleId: schedule.id,
          quantity,
          description,
          specialInstructions,
          customerId,
        },
      });
      
      if (error) throw error;
      
      // Simulate a payment processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Call the edge function to confirm the payment
      const { data: confirmData, error: confirmError } = await supabase.functions.invoke('confirm-payment', {
        body: {
          paymentId: data.paymentId,
        },
      });
      
      if (confirmError) throw confirmError;
      
      toast.success("Payment successful!");
      
      // Redirect to the tracking page
      navigate(`/track/${confirmData.order.id}`);
    } catch (error: any) {
      console.error("Payment error:", error);
      toast.error(`Payment failed: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Complete Your Payment</DialogTitle>
          <DialogDescription>
            Secure payment for your food delivery order.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <h3 className="font-medium text-sm mb-2">Order Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Route:</span>
              <span>{schedule.from_location} to {schedule.to_location}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Date & Time:</span>
              <span>{new Date(schedule.departure_date).toLocaleDateString()} at {formatTime(schedule.departure_time)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Quantity:</span>
              <span>{quantity} {quantity === 1 ? 'package' : 'packages'}</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Total:</span>
              <span>${(quantity * 10).toFixed(2)}</span>
            </div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="cardHolder"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cardholder Name</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input {...field} placeholder="John Smith" />
                      <User className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="cardNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Card Number</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input {...field} placeholder="4111 1111 1111 1111" />
                      <CreditCard className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="expiryDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expiry Date</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input {...field} placeholder="MM/YY" />
                        <Calendar className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="cvv"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CVV</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input {...field} placeholder="123" />
                        <Lock className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <DialogFooter className="pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                disabled={isProcessing}
              >
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-collegeBites-blue hover:bg-collegeBites-darkBlue"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Pay ${(quantity * 10).toFixed(2)}
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default Checkout;
