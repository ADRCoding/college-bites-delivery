
import { MapPin, Check, Clock } from "lucide-react";

type DeliveryTimelineProps = {
  locationUpdates: any[];
  orderStatus: string | undefined;
};

export const DeliveryTimeline = ({ locationUpdates, orderStatus }: DeliveryTimelineProps) => {
  return (
    <div className="relative pb-12">
      {/* Vertical timeline line */}
      <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200"></div>
      
      {/* Status timeline */}
      <div className="space-y-8">
        {locationUpdates.length > 0 ? (
          locationUpdates.map((update, index) => (
            <div key={index} className="relative flex items-start group">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-collegeBites-blue ring-8 ring-white z-10">
                <MapPin className="h-5 w-5" />
              </div>
              <div className="ml-6">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <div className="flex justify-between">
                    <h3 className="font-medium">Location Update</h3>
                    <time className="text-xs text-gray-500">
                      {new Date(update.created_at).toLocaleTimeString()}
                    </time>
                  </div>
                  <p className="text-gray-600 mt-1">
                    <span className="font-medium">Coordinates:</span> {update.latitude}, {update.longitude}
                  </p>
                  {update.note && (
                    <p className="text-gray-600 mt-1">
                      {update.note}
                    </p>
                  )}
                  <a 
                    href={`https://maps.google.com/?q=${update.latitude},${update.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-collegeBites-blue hover:underline text-sm mt-2 inline-block"
                  >
                    View on Google Maps →
                  </a>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="relative flex items-start group">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-yellow-100 text-yellow-600 ring-8 ring-white z-10">
              <Clock className="h-5 w-5" />
            </div>
            <div className="ml-6">
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <h3 className="font-medium">Waiting for Driver Updates</h3>
                <p className="text-gray-600 mt-1">
                  The driver will update the location when your package is in transit.
                </p>
              </div>
            </div>
          </div>
        )}
        
        <div className="relative flex items-start group">
          <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
            orderStatus === 'completed' 
              ? 'bg-green-100 text-green-600' 
              : 'bg-gray-100 text-gray-400'
          } ring-8 ring-white z-10`}>
            <Check className="h-5 w-5" />
          </div>
          <div className="ml-6">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <h3 className="font-medium">
                {orderStatus === 'completed' ? 'Delivered' : 'Delivery Pending'}
              </h3>
              <p className="text-gray-600 mt-1">
                {orderStatus === 'completed' 
                  ? 'Your package has been delivered successfully!' 
                  : 'Your package will be marked as delivered upon arrival.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
