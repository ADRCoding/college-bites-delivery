
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format, addDays } from "date-fns";
import { toast } from "sonner";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Calendar,
  Clock,
  User,
  Check,
  Plus,
  Car,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Mock data for scheduled drives
const mockDrives = [
  {
    id: "1",
    driver: "John Smith",
    from: "Los Angeles",
    to: "UCLA",
    date: new Date(2023, 6, 15),
    time: "2:00 PM",
    capacity: 4,
    booked: 2,
  },
  {
    id: "2",
    driver: "Mary Johnson",
    from: "San Diego",
    to: "USC",
    date: new Date(2023, 6, 18),
    time: "10:00 AM",
    capacity: 3,
    booked: 1,
  },
  {
    id: "3",
    driver: "Robert Davis",
    from: "Orange County",
    to: "Cal State Fullerton",
    date: new Date(2023, 6, 20),
    time: "1:30 PM",
    capacity: 5,
    booked: 3,
  },
  {
    id: "4",
    driver: "Sarah Wilson",
    from: "Santa Barbara",
    to: "UCSB",
    date: new Date(2023, 7, 5),
    time: "9:00 AM",
    capacity: 2,
    booked: 0,
  },
];

const Portal = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("upcoming");
  const [bookingDate, setBookingDate] = useState<Date | undefined>(undefined);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [selectedDrive, setSelectedDrive] = useState<typeof mockDrives[0] | null>(null);
  
  // New drive form state
  const [newDriveOpen, setNewDriveOpen] = useState(false);
  const [newDriveDate, setNewDriveDate] = useState<Date | undefined>(undefined);
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [capacity, setCapacity] = useState("1");

  // Filter upcoming and past drives based on current date
  const today = new Date();
  const upcomingDrives = mockDrives.filter(drive => drive.date >= today);
  const pastDrives = mockDrives.filter(drive => drive.date < today);

  const handleBookDrive = (drive: typeof mockDrives[0]) => {
    setSelectedDrive(drive);
    setBookingDialogOpen(true);
  };

  const confirmBooking = () => {
    if (selectedDrive) {
      toast.success(`Successfully booked a delivery with ${selectedDrive.driver} on ${format(selectedDrive.date, "PPP")}`);
      setBookingDialogOpen(false);
      setSelectedDrive(null);
    }
  };

  const handleAddNewDrive = () => {
    if (!newDriveDate || !fromLocation || !toLocation || !departureTime) {
      toast.error("Please fill in all required fields");
      return;
    }

    toast.success("New drive scheduled successfully!");
    setNewDriveOpen(false);
    
    // Reset form
    setNewDriveDate(undefined);
    setFromLocation("");
    setToLocation("");
    setDepartureTime("");
    setCapacity("1");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-collegeBites-darkBlue">Drive Portal</h1>
              <p className="text-gray-600 mt-1">
                Find and book parent drives to deliver homemade food
              </p>
            </div>
            <Button 
              variant="outline"
              className="flex gap-2 items-center"
              onClick={() => navigate('/dashboard')}
            >
              Back to Dashboard
            </Button>
          </div>

          <Tabs defaultValue="upcoming" className="space-y-4" onValueChange={setSelectedTab}>
            <div className="flex justify-between items-center">
              <TabsList>
                <TabsTrigger value="upcoming" className="relative px-8">
                  Upcoming Drives
                  {upcomingDrives.length > 0 && (
                    <span className="absolute right-2 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-collegeBites-blue text-[10px] text-white">
                      {upcomingDrives.length}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="past">Past Drives</TabsTrigger>
                <TabsTrigger value="calendar">Calendar View</TabsTrigger>
              </TabsList>
              
              <Dialog open={newDriveOpen} onOpenChange={setNewDriveOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-collegeBites-blue hover:bg-collegeBites-darkBlue">
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Drive
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Schedule a New Drive</DialogTitle>
                    <DialogDescription>
                      Enter the details of your trip to help other parents deliver food to students
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="date">Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            id="date"
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !newDriveDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {newDriveDate ? format(newDriveDate, "PPP") : <span>Select date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={newDriveDate}
                            onSelect={setNewDriveDate}
                            initialFocus
                            disabled={(date) => date < addDays(new Date(), 1)}
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="from">From (City)</Label>
                      <Input 
                        id="from" 
                        value={fromLocation} 
                        onChange={(e) => setFromLocation(e.target.value)} 
                        placeholder="e.g. Los Angeles"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="to">To (College/University)</Label>
                      <Input 
                        id="to" 
                        value={toLocation} 
                        onChange={(e) => setToLocation(e.target.value)} 
                        placeholder="e.g. UCLA"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="time">Departure Time</Label>
                      <Input 
                        id="time" 
                        type="time" 
                        value={departureTime} 
                        onChange={(e) => setDepartureTime(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="capacity">Available Capacity for Packages</Label>
                      <Input 
                        id="capacity" 
                        type="number" 
                        min="1" 
                        max="10" 
                        value={capacity} 
                        onChange={(e) => setCapacity(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setNewDriveOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddNewDrive} className="bg-collegeBites-blue hover:bg-collegeBites-darkBlue">
                      Schedule Drive
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            <TabsContent value="upcoming" className="space-y-4">
              <div className="bg-white shadow rounded-lg overflow-hidden">
                {upcomingDrives.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Driver</TableHead>
                        <TableHead>Route</TableHead>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Availability</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {upcomingDrives.map((drive) => (
                        <TableRow key={drive.id}>
                          <TableCell className="font-medium">{drive.driver}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                              {drive.from} to {drive.to}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                                {format(drive.date, "PP")}
                              </div>
                              <div className="flex items-center mt-1">
                                <Clock className="h-4 w-4 mr-1 text-gray-500" />
                                {drive.time}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <User className="h-4 w-4 mr-1 text-gray-500" />
                              {drive.capacity - drive.booked} of {drive.capacity} spots left
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              onClick={() => handleBookDrive(drive)} 
                              disabled={drive.capacity - drive.booked === 0}
                              className="bg-collegeBites-blue hover:bg-collegeBites-darkBlue"
                            >
                              Book
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
                      There are no upcoming drives scheduled at the moment.
                    </p>
                    <div className="mt-6">
                      <Button 
                        onClick={() => setNewDriveOpen(true)}
                        className="bg-collegeBites-blue hover:bg-collegeBites-darkBlue"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add New Drive
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="past" className="space-y-4">
              <div className="bg-white shadow rounded-lg overflow-hidden">
                {pastDrives.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Driver</TableHead>
                        <TableHead>Route</TableHead>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Packages Delivered</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pastDrives.map((drive) => (
                        <TableRow key={drive.id}>
                          <TableCell className="font-medium">{drive.driver}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                              {drive.from} to {drive.to}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                                {format(drive.date, "PP")}
                              </div>
                              <div className="flex items-center mt-1">
                                <Clock className="h-4 w-4 mr-1 text-gray-500" />
                                {drive.time}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <User className="h-4 w-4 mr-1 text-gray-500" />
                              {drive.booked} of {drive.capacity}
                            </div>
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
                      You haven't participated in any drives yet.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="calendar" className="space-y-4">
              <div className="bg-white p-4 shadow rounded-lg">
                <div className="flex flex-col space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold">Available Drives by Date</h2>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="icon">
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <span className="text-sm font-medium">July 2023</span>
                      <Button variant="outline" size="icon">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-7 gap-2 text-center text-xs">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                      <div key={day} className="py-2 font-medium">{day}</div>
                    ))}
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                      const hasDrive = mockDrives.some(
                        drive => new Date(drive.date).getDate() === day && 
                                new Date(drive.date).getMonth() === 6
                      );
                      
                      return (
                        <div 
                          key={day} 
                          className={cn(
                            "aspect-square flex flex-col items-center justify-start p-2 rounded-md border text-sm",
                            hasDrive ? "bg-blue-50 border-blue-200" : "bg-white border-gray-200",
                            day === 15 && "ring-2 ring-collegeBites-blue"
                          )}
                        >
                          <span className="font-medium mb-1">{day}</span>
                          {hasDrive && (
                            <div className="w-2 h-2 rounded-full bg-collegeBites-blue mt-auto mb-1"></div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="border-t pt-4 mt-2">
                    <h3 className="font-medium text-sm mb-2">Upcoming Drives:</h3>
                    <div className="space-y-2">
                      {upcomingDrives.slice(0, 3).map((drive) => (
                        <div key={drive.id} className="flex justify-between items-center p-2 border rounded-md bg-gray-50">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-collegeBites-blue" />
                            <span className="text-sm">{format(drive.date, "PP")} ({drive.time})</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-gray-500">{drive.from} → {drive.to}</span>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-collegeBites-blue hover:text-collegeBites-darkBlue"
                              onClick={() => handleBookDrive(drive)}
                            >
                              Book
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Dialog open={bookingDialogOpen} onOpenChange={setBookingDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Book a Delivery Spot</DialogTitle>
            <DialogDescription>
              Confirm your booking details for food delivery
            </DialogDescription>
          </DialogHeader>
          {selectedDrive && (
            <div className="space-y-4 py-4">
              <div className="space-y-1">
                <h4 className="font-medium text-sm">Driver</h4>
                <p className="text-sm">{selectedDrive.driver}</p>
              </div>
              <div className="space-y-1">
                <h4 className="font-medium text-sm">Trip Details</h4>
                <p className="text-sm">From {selectedDrive.from} to {selectedDrive.to}</p>
                <p className="text-sm">
                  {format(selectedDrive.date, "PPP")} at {selectedDrive.time}
                </p>
              </div>
              <div className="space-y-1">
                <h4 className="font-medium text-sm">Package Description</h4>
                <Input placeholder="Describe your food package" />
              </div>
              <div className="space-y-1">
                <h4 className="font-medium text-sm">Special Instructions</h4>
                <Input placeholder="Any dietary or handling instructions" />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setBookingDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmBooking} className="bg-collegeBites-blue hover:bg-collegeBites-darkBlue">
              <Check className="mr-2 h-4 w-4" /> Confirm Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default Portal;
