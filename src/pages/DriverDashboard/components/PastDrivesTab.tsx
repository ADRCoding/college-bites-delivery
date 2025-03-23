
import { Calendar, Clock, MapPin } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Car } from "lucide-react";
import { formatTime } from "@/utils/formatTime";

type PastDrivesTabProps = {
  drives: any[];
  loading: boolean;
};

export const PastDrivesTab = ({ drives, loading }: PastDrivesTabProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Your Past Drives</h2>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <p>Loading past drives...</p>
          </div>
        ) : drives.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Route</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Utilization</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {drives.map((drive) => (
                <TableRow key={drive.id}>
                  <TableCell>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                      {drive.from_location} to {drive.to_location}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                        {new Date(drive.departure_date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center mt-1">
                        <Clock className="h-4 w-4 mr-1 text-gray-500" />
                        {formatTime(drive.departure_time)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{drive.capacity}</TableCell>
                  <TableCell>
                    {drive.capacity - drive.available_capacity} / {drive.capacity} used
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
              You haven't completed any drives yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
