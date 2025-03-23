
import { Package, Navigation, Calendar, Clock, CreditCard } from "lucide-react";
import {
  Card,
  CardContent,
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
  if (!order || !schedule) return null;

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Package className="mr-2 h-5 w-5 text-collegeBites-blue" />
          Order Details
          <div className={`ml-auto px-3 py-1 text-sm rounded-full bg-${deliveryStatus.color}-100 text-${deliveryStatus.color}-800`}>
            {deliveryStatus.status}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:justify-between gap-2 md:gap-4">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-500">Order ID</h3>
              <p className="mt-1 font-mono text-sm">{order.id.substring(0, 8)}</p>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-500">Payment ID</h3>
              <p className="mt-1 font-mono text-sm">{order.payment_id.substring(0, 12)}...</p>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-500">Quantity</h3>
              <p className="mt-1">{order.quantity} {order.quantity > 1 ? 'packages' : 'package'}</p>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-500">Total Amount</h3>
              <p className="mt-1">${order.quantity * 10}.00</p>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-500 flex items-center">
              <Navigation className="mr-2 h-4 w-4 text-collegeBites-blue" />
              Delivery Route
            </h3>
            <p className="mt-1 text-base font-medium">
              {schedule.from_location} to {schedule.to_location}
            </p>
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <Calendar className="mr-1 h-4 w-4" />
              <span className="mr-3">{new Date(schedule.departure_date).toLocaleDateString()}</span>
              <Clock className="mr-1 h-4 w-4" />
              <span>{formatTime(schedule.departure_time)}</span>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-500 flex items-center">
              <Package className="mr-2 h-4 w-4 text-collegeBites-blue" />
              Package Details
            </h3>
            <p className="mt-1">{order.description || "Food Package"}</p>
            {order.special_instructions && (
              <div className="mt-2">
                <h4 className="text-sm font-medium text-gray-500">Special Instructions</h4>
                <p className="mt-1 text-sm bg-gray-50 p-2 rounded">{order.special_instructions}</p>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-500 flex items-center">
              <CreditCard className="mr-2 h-4 w-4 text-collegeBites-blue" />
              Payment Status
            </h3>
            <div className="mt-1 flex items-center">
              <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
              <p>Paid</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
