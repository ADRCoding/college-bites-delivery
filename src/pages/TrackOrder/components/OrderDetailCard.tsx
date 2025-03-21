
import { Package, Truck } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatTime } from "../utils/formatTime";

type OrderDetailCardProps = {
  order: any;
  schedule: any;
  deliveryStatus: {
    status: string;
    color: string;
  };
};

export const OrderDetailCard = ({ order, schedule, deliveryStatus }: OrderDetailCardProps) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Order #{order.id.substring(0, 8)}</CardTitle>
            <CardDescription>
              Placed on {new Date(order.created_at).toLocaleDateString()} at {new Date(order.created_at).toLocaleTimeString()}
            </CardDescription>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium bg-${deliveryStatus.color}-100 text-${deliveryStatus.color}-800`}>
            {deliveryStatus.status}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-start space-x-4">
            <Package className="h-5 w-5 text-gray-500 mt-0.5" />
            <div>
              <h3 className="font-medium">Package Details</h3>
              <p className="text-gray-600">{order.description || "Food Package"}</p>
              <p className="text-gray-600">Quantity: {order.quantity} box(es)</p>
              {order.special_instructions && (
                <p className="text-gray-600 mt-1">
                  <span className="font-medium">Special Instructions:</span> {order.special_instructions}
                </p>
              )}
            </div>
          </div>
          
          {schedule && (
            <div className="flex items-start space-x-4">
              <Truck className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <h3 className="font-medium">Delivery Details</h3>
                <p className="text-gray-600">
                  From <span className="font-medium">{schedule.from_location}</span> to <span className="font-medium">{schedule.to_location}</span>
                </p>
                <p className="text-gray-600">
                  Scheduled for {new Date(schedule.departure_date).toLocaleDateString()} at {formatTime(schedule.departure_time)}
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
