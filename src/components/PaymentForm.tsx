
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type PaymentFormProps = {
  amount: number;
  description: string;
  schedule: any;
  quantity: number;
  specialInstructions?: string;
  onSuccess: (orderId: string) => void;
  onCancel: () => void;
};

const PaymentForm = ({
  amount,
  description,
  schedule,
  quantity,
  specialInstructions = "",
  onSuccess,
  onCancel,
}: PaymentFormProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Payment form state
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardholderName, setCardholderName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setError("You must be logged in to make a payment");
      return;
    }

    // Validate form
    if (!cardNumber || !expiryDate || !cvv || !cardholderName) {
      setError("Please fill in all payment details");
      return;
    }

    // Simple validation
    if (cardNumber.length < 16 || cvv.length < 3) {
      setError("Invalid card details");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Create a payment via Supabase Edge Function
      const { data, error: paymentError } = await supabase.functions.invoke('create-payment', {
        body: {
          scheduleId: schedule.id,
          quantity,
          description,
          specialInstructions,
          customerId: user.id
        }
      });

      if (paymentError) {
        throw new Error(paymentError.message || "Failed to create payment");
      }

      const { paymentId, orderId } = data;

      if (!paymentId) {
        throw new Error("No payment ID returned from the server");
      }

      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Confirm payment success on the backend
      const { error: confirmError } = await supabase.functions.invoke('confirm-payment', {
        body: {
          paymentId: paymentId,
        }
      });

      if (confirmError) {
        throw new Error(confirmError.message || "Failed to confirm payment");
      }

      toast.success("Payment successful!");
      onSuccess(orderId);
    } catch (err: any) {
      console.error("Payment error:", err);
      setError(err.message || "Payment failed. Please try again.");
      toast.error("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  // Format expiry date MM/YY
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 3) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    return value;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCardNumber(formatCardNumber(value));
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 5) {
      setExpiryDate(formatExpiryDate(value.replace(/[^\d]/g, '')));
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Payment Details</CardTitle>
        <CardDescription>
          Complete your food delivery payment
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="order-summary">Order Summary</Label>
            <div className="text-sm bg-gray-50 p-3 rounded-md">
              <p><span className="font-medium">Item:</span> {description}</p>
              <p><span className="font-medium">Quantity:</span> {quantity}</p>
              <p><span className="font-medium">Total Amount:</span> ${(amount / 100).toFixed(2)}</p>
              <p><span className="font-medium">Delivery Route:</span> {schedule.from_location} to {schedule.to_location}</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cardholder-name">Cardholder Name</Label>
            <Input
              id="cardholder-name"
              value={cardholderName}
              onChange={(e) => setCardholderName(e.target.value)}
              placeholder="John Doe"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="card-number">Card Number</Label>
            <Input
              id="card-number"
              value={cardNumber}
              onChange={handleCardNumberChange}
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiry">Expiry Date</Label>
              <Input
                id="expiry"
                value={expiryDate}
                onChange={handleExpiryDateChange}
                placeholder="MM/YY"
                maxLength={5}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cvv">CVV</Label>
              <Input
                id="cvv"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.slice(0, 3))}
                placeholder="123"
                maxLength={3}
                required
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm py-2">{error}</div>
          )}
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit}
          disabled={loading}
          className="bg-collegeBites-blue hover:bg-collegeBites-darkBlue"
        >
          {loading ? (
            <>
              <span className="animate-spin mr-2">⏳</span>
              Processing...
            </>
          ) : (
            `Pay $${(amount / 100).toFixed(2)}`
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PaymentForm;
