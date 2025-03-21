
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type LocationUpdateDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentLocation: {
    latitude: string;
    longitude: string;
  };
  locationNote: string;
  setCurrentLocation: (location: { latitude: string; longitude: string }) => void;
  setLocationNote: (note: string) => void;
  saveLocationUpdate: () => Promise<void>;
};

export const LocationUpdateDialog = ({
  open,
  onOpenChange,
  currentLocation,
  locationNote,
  setCurrentLocation,
  setLocationNote,
  saveLocationUpdate
}: LocationUpdateDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Delivery Location</DialogTitle>
          <DialogDescription>
            Update the current location of this delivery to keep customers informed.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="latitude">Latitude</Label>
              <Input 
                id="latitude" 
                value={currentLocation.latitude}
                onChange={(e) => setCurrentLocation({...currentLocation, latitude: e.target.value})}
                placeholder="e.g. 34.0522"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="longitude">Longitude</Label>
              <Input 
                id="longitude" 
                value={currentLocation.longitude}
                onChange={(e) => setCurrentLocation({...currentLocation, longitude: e.target.value})}
                placeholder="e.g. -118.2437"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="note">Status Note (Optional)</Label>
            <Textarea 
              id="note" 
              value={locationNote}
              onChange={(e) => setLocationNote(e.target.value)}
              placeholder="e.g. Currently on I-405, estimated arrival in 20 minutes"
              className="min-h-[80px]"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={saveLocationUpdate}
            className="bg-collegeBites-blue hover:bg-collegeBites-darkBlue"
          >
            Update Location
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
