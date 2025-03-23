
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
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

type UpcomingDrivesTabProps = {
  drives: any[];
  loading: boolean;
};

export const UpcomingDrivesTab = ({ drives, loading }: UpcomingDrivesTabProps) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Your Upcoming Drives</h2>
        <Button 
          className="bg-collegeBites-blue hover:bg-collegeBites-darkBlue"
          onClick={() => navigate('/portal')}
        >
          Schedule New Drive
        </Button>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <p>Loading your drives...</p>
          </div>
        ) : drives.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Route</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Available</TableHead>
                <TableHead className="text-right">Action</TableHead>
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
                  <TableCell>{drive.available_capacity}</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate('/portal')}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="p-8 text-center">
            <Car className="h-12 w-12 mx-auto text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No upcoming drives</h3>
            <p className="mt-1 text-sm text-gray-500">
              You haven't scheduled any upcoming drives.
            </p>
            <div className="mt-6">
              <Button 
                onClick={() => navigate('/portal')}
                className="bg-collegeBites-blue hover:bg-collegeBites-darkBlue"
              >
                Schedule a Drive
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
