import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { Calendar, Clock, MapPin, Package, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Portal = () => {
  const { user, userType } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [driverSchedules, setDriverSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (userType === "parent") {
      fetchParentOrders();
    } else if (userType === "student") {
      fetchStudentOrders();
    } else if (userType === "driver") {
      fetchDriverSchedules();
    }
  }, [user, userType, navigate]);

  const fetchParentOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("orders")
        .select("*, student_profiles(*)")
        .eq("parent_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      toast.error("Failed to fetch orders: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("orders")
        .select("*, parent_profiles(*)")
        .eq("student_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      toast.error("Failed to fetch orders: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchDriverSchedules = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("driver_schedules")
        .select("*, orders(*)")
        .eq("driver_id", user.id)
        .order("scheduled_date", { ascending: false });

      if (error) throw error;
      setDriverSchedules(data || []);
    } catch (error) {
      toast.error("Failed to fetch schedules: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in_transit":
        return "bg-blue-100 text-blue-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    try {
      return format(parseISO(dateString), "MMM d, yyyy");
    } catch (error) {
      return "Invalid date";
    }
  };

  const renderParentOrStudentContent = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Your Orders</h2>
        {userType === "parent" && (
          <Button
            onClick={() => navigate("/schedule-drive")}
            className="bg-collegeBites-blue hover:bg-collegeBites-darkBlue"
          >
            Schedule New Delivery
          </Button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-collegeBites-blue mx-auto"></div>
          <p className="mt-3 text-gray-600">Loading your orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <Package className="h-12 w-12 text-gray-400 mx-auto" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No orders found</h3>
          <p className="mt-1 text-gray-500">
            {userType === "parent"
              ? "You haven't scheduled any deliveries yet."
              : "You don't have any incoming deliveries."}
          </p>
          {userType === "parent" && (
            <Button
              onClick={() => navigate("/schedule-drive")}
              className="mt-4 bg-collegeBites-blue hover:bg-collegeBites-darkBlue"
            >
              Schedule Your First Delivery
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white shadow-sm rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Order #{order.id.substring(0, 8)}
                  </h3>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>
                        Scheduled for {formatDate(order.scheduled_date)}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>
                        {order.time_slot || "Time slot not specified"}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>
                        {order.delivery_location || "Location not specified"}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <User className="h-4 w-4 mr-2" />
                      <span>
                        {userType === "parent"
                          ? `To: ${order.student_profiles?.name || "Student"}`
                          : `From: ${order.parent_profiles?.name || "Parent"}`}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(
                      order.status
                    )}`}
                  >
                    {order.status === "pending"
                      ? "Pending"
                      : order.status === "in_transit"
                      ? "In Transit"
                      : order.status === "delivered"
                      ? "Delivered"
                      : order.status === "cancelled"
                      ? "Cancelled"
                      : "Unknown"}
                  </span>
                </div>
              </div>
              <div className="mt-4 border-t border-gray-100 pt-4">
                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => navigate(`/track/${order.id}`)}
                    className="text-collegeBites-blue hover:text-collegeBites-darkBlue border-collegeBites-blue hover:border-collegeBites-darkBlue"
                  >
                    Track Order
                  </Button>
                  {order.status === "pending" && userType === "parent" && (
                    <Button
                      variant="outline"
                      className="text-red-600 hover:text-red-700 border-red-600 hover:border-red-700"
                    >
                      Cancel Order
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderDriverContent = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Your Delivery Schedule</h2>
        <Button
          onClick={() => fetchDriverSchedules()}
          className="bg-collegeBites-blue hover:bg-collegeBites-darkBlue"
        >
          Refresh Schedule
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-collegeBites-blue mx-auto"></div>
          <p className="mt-3 text-gray-600">Loading your schedule...</p>
        </div>
      ) : driverSchedules.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No scheduled deliveries</h3>
          <p className="mt-1 text-gray-500">
            You don't have any deliveries scheduled at the moment.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {driverSchedules.map((schedule) => (
            <div
              key={schedule.id}
              className="bg-white shadow-sm rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Schedule #{schedule.id.substring(0, 8)}
                  </h3>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>
                        Date: {formatDate(schedule.scheduled_date)}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>
                        Time: {schedule.time_slot || "Not specified"}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>
                        Route: {schedule.route || "Not specified"}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Package className="h-4 w-4 mr-2" />
                      <span>
                        Orders: {schedule.orders?.length || 0} assigned
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      schedule.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : schedule.status === "in_progress"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {schedule.status === "completed"
                      ? "Completed"
                      : schedule.status === "in_progress"
                      ? "In Progress"
                      : "Scheduled"}
                  </span>
                </div>
              </div>
              <div className="mt-4 border-t border-gray-100 pt-4">
                <Button
                  variant="outline"
                  onClick={() => navigate(`/driver-route/${schedule.id}`)}
                  className="text-collegeBites-blue hover:text-collegeBites-darkBlue border-collegeBites-blue hover:border-collegeBites-darkBlue"
                >
                  View Route Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 max-w-5xl">
        <div className="bg-white shadow-sm rounded-xl p-6 md:p-8">
          <h1 className="text-3xl font-bold text-collegeBites-darkBlue mb-6">
            {userType === "parent"
              ? "Parent Portal"
              : userType === "student"
              ? "Student Portal"
              : "Driver Portal"}
          </h1>

          {userType === "driver"
            ? renderDriverContent()
            : renderParentOrStudentContent()}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Portal;
