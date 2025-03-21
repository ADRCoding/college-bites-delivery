
import { Phone } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const SupportCard = () => {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-lg">Need Help?</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4">
          If you have any questions about your delivery, please contact customer service.
        </p>
        <Button 
          variant="outline" 
          className="w-full flex items-center justify-center gap-2"
          onClick={() => toast.info("Contact feature coming soon!")}
        >
          <Phone className="h-4 w-4" />
          Contact Support
        </Button>
      </CardContent>
    </Card>
  );
};
