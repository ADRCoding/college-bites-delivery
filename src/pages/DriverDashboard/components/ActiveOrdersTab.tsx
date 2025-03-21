
import { Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Package } from "lucide-react";

type ActiveOrdersTabProps = {
  orders: any[];
  loading: boolean;
  updateDeliveryLocation: (orderId: string) => void;
};

export const ActiveOrdersTab = ({ orders, loading, updateDeliveryLocation }: ActiveOrdersTabProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Active Orders to Deliver</h2>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <p>Loading orders...</p>
          </div>
        ) : orders.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order Details</TableHead>
                <TableHead>Route</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <div className="font-medium">{order.description || "Food Package"}</div>
                    <div className="text-sm text-gray-500">Quantity: {order.quantity}</div>
                    {order.special_instructions && (
                      <div className="text-xs text-gray-500 mt-1">
                        Note: {order.special_instructions}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {order.driver_schedules.from_location} to {order.driver_schedules.to_location}
                  </TableCell>
                  <TableCell>
                    {new Date(order.driver_schedules.departure_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      order.status === 'completed' ? 'bg-green-100 text-green-800' :
                      order.status === 'in_transit' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status === 'pending' ? 'Pending' : 
                       order.status === 'in_transit' ? 'In Transit' : 
                       'Completed'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => updateDeliveryLocation(order.id)}
                      >
                        <Map className="h-4 w-4 mr-1" />
                        Update Location
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="p-8 text-center">
            <Package className="h-12 w-12 mx-auto text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No active orders</h3>
            <p className="mt-1 text-sm text-gray-500">
              You don't have any orders to deliver at the moment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
