
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import PaymentForm from "./PaymentForm";
import { toast } from "sonner";

type CheckoutProps = {
  isOpen: boolean;
  onClose: () => void;
  schedule: any;
  quantity: number;
  description: string;
  specialInstructions?: string;
};

const Checkout = ({
  isOpen,
  onClose,
  schedule,
  quantity,
  description,
  specialInstructions,
}: CheckoutProps) => {
  const navigate = useNavigate();
  const amount = quantity * 1000; // $10 per food box

  const handlePaymentSuccess = (orderId: string) => {
    toast.success("Order placed successfully!");
    onClose();
    navigate(`/track/${orderId}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogTitle>Complete Your Order</DialogTitle>
        <div className="py-4">
          <PaymentForm
            amount={amount}
            description={description}
            schedule={schedule}
            quantity={quantity}
            specialInstructions={specialInstructions}
            onSuccess={handlePaymentSuccess}
            onCancel={onClose}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Checkout;
