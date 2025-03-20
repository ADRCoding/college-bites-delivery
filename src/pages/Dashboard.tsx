import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { LogOut, Users, Car, Package, User, UtensilsCrossed } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

type UserRole = "parent" | "parent_driver" | "student";

const Dashboard = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<UserRole>("parent");

  // Simulate fetching user data from a backend
  useEffect(() => {
    // In a real app, you would fetch actual user data
    // For demo purposes, we'll simulate a parent user
    const storedRole = localStorage.getItem("userRole") as UserRole | null;
    setUserRole(storedRole || "parent");
  }, []);

  const handleLogout = () => {
    // Clear any stored tokens or user data
    localStorage.removeItem("userRole");
    toast.success("Logged out successfully");
    navigate("/");
  };

  const goToPortal = () => {
    navigate("/portal");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-collegeBites-darkBlue">Dashboard</h1>
              <p className="text-gray-600 mt-1">
                {userRole === "parent" && "Welcome to your Parent dashboard"}
                {userRole === "parent_driver" && "Welcome to your Parent Driver dashboard"}
                {userRole === "student" && "Welcome to your Student dashboard"}
              </p>
            </div>
            <Button 
              variant="outline"
              className="flex gap-2 items-center"
              onClick={handleLogout}
            >
              <LogOut size={16} />
              Sign Out
            </Button>
          </div>

          {/* Role-specific content */}
          {userRole === "parent" && <ParentDashboard goToPortal={goToPortal} />}
          {userRole === "parent_driver" && <ParentDriverDashboard goToPortal={goToPortal} />}
          {userRole === "student" && <StudentDashboard goToPortal={goToPortal} />}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

const ParentDashboard = ({ goToPortal }: { goToPortal: () => void }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Deliveries</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">2 deliveries in process</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Deliveries</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+3 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Connected Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">Your connected children</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Your Recent Deliveries</h2>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="divide-y">
            <div className="p-4 flex items-center justify-between">
              <div>
                <p className="font-medium">Homemade Pasta and Cookies</p>
                <p className="text-sm text-gray-500">Delivered on June 10, 2023</p>
              </div>
              <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                Delivered
              </span>
            </div>
            <div className="p-4 flex items-center justify-between">
              <div>
                <p className="font-medium">Weekend Meal Prep</p>
                <p className="text-sm text-gray-500">In transit - Expected June 18, 2023</p>
              </div>
              <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                In Transit
              </span>
            </div>
            <div className="p-4 flex items-center justify-between">
              <div>
                <p className="font-medium">Birthday Cake</p>
                <p className="text-sm text-gray-500">Scheduled for June 24, 2023</p>
              </div>
              <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                Scheduled
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 flex gap-4">
        <Button className="bg-collegeBites-blue hover:bg-collegeBites-darkBlue">
          Schedule New Delivery
        </Button>
        
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={goToPortal}
        >
          <Car className="h-4 w-4" />
          View Available Drives
        </Button>
      </div>
    </div>
  );
};

const ParentDriverDashboard = ({ goToPortal }: { goToPortal: () => void }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Your Campus Visit</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">June 22</div>
            <p className="text-xs text-muted-foreground">Your next trip to campus</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Food Packages</CardTitle>
            <UtensilsCrossed className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Packages to deliver on your next trip</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Help Provided</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Families you've helped</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Packages to Deliver on Your Next Trip</h2>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="divide-y">
            <div className="p-4 flex items-center justify-between">
              <div>
                <p className="font-medium">Sandra's Homemade Lasagna</p>
                <p className="text-sm text-gray-500">For: Michael Johnson (UCLA Dorms)</p>
                <p className="text-sm text-gray-500">Pickup: 123 Parent St, Los Angeles</p>
              </div>
              <Button size="sm" variant="outline">
                Details
              </Button>
            </div>
            <div className="p-4 flex items-center justify-between">
              <div>
                <p className="font-medium">Batch of Cookies and Study Snacks</p>
                <p className="text-sm text-gray-500">For: Emma Williams (USC Housing)</p>
                <p className="text-sm text-gray-500">Pickup: 456 Family Ave, Los Angeles</p>
              </div>
              <Button size="sm" variant="outline">
                Details
              </Button>
            </div>
            <div className="p-4 flex items-center justify-between">
              <div>
                <p className="font-medium">Homemade Curry and Rice</p>
                <p className="text-sm text-gray-500">For: David Lee (UCLA Apartments)</p>
                <p className="text-sm text-gray-500">Pickup: 789 Parent Blvd, Los Angeles</p>
              </div>
              <Button size="sm" variant="outline">
                Details
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 flex gap-4">
        <Button className="bg-collegeBites-blue hover:bg-collegeBites-darkBlue">
          Update Campus Visit Schedule
        </Button>
        
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={goToPortal}
        >
          <Car className="h-4 w-4" />
          Manage Your Drives
        </Button>
      </div>
    </div>
  );
};

const StudentDashboard = ({ goToPortal }: { goToPortal: () => void }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Deliveries</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">Food coming your way</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Received Packages</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Connected Family</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Family members connected</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Your Upcoming Deliveries</h2>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="divide-y">
            <div className="p-4 flex items-center justify-between">
              <div>
                <p className="font-medium">Weekend Meal Prep</p>
                <p className="text-sm text-gray-500">Expected June 18, 2023</p>
                <p className="text-sm text-gray-500">From: Mom</p>
              </div>
              <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                In Transit
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Food Preferences</h2>
        <Card>
          <CardContent className="pt-6">
            <p className="mb-2">Let your family know what you're craving:</p>
            <div className="flex gap-4">
              <Button className="bg-collegeBites-blue hover:bg-collegeBites-darkBlue">
                Update Food Preferences
              </Button>
              
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={goToPortal}
              >
                <Car className="h-4 w-4" />
                View Upcoming Deliveries
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
