import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, ExternalLink } from "lucide-react";
import { toast } from "react-hot-toast";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Campaign } from "@/pages/dashboard/advertiser/CampaignsPage";
import { calculateCampaignDistribution } from "@/utils/calculateCampaignDistribution";

interface OfferDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  offer: Campaign | null;
}

export function OfferDetailsModal({
  isOpen,
  onClose,
  offer,
}: OfferDetailsModalProps) {
  if (!offer) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch (e) {
      return dateString;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[1400px] p-0 overflow-hidden">
        <div className="flex flex-col mt-4">
          {/* Header section with offer image and basic info */}
          <div className="p-6 border-b">
            <div className="flex gap-4">
              <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={offer?.primary_image || "/placeholder-offer.png"}
                  alt={offer?.campaign_name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="flex flex-col flex-grow">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold capitalize">
                    {offer?.campaign_name}
                  </h2>
                  <Button
                    asChild
                    variant="outline"
                    className="bg-blue-500 hover:bg-blue-600 mt-2 text-white"
                  >
                    <a
                      href={offer?.preview_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Preview Offer
                      <ExternalLink size={16} />
                    </a>
                  </Button>
                </div>
                <p className="text-muted-foreground text-sm font-mono">
                  ID: {offer?.id}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => copyToClipboard(offer.id.toString())}
                  >
                    <Copy size={14} />
                  </Button>
                </p>
                <p className="text-muted-foreground text-sm mt-1 pb-2">
                  Description: {offer.description || "No description available"}
                </p>
                <div className="flex items-center gap-2 mt-auto">
                  <Badge className="capitalize">{offer?.category}</Badge>
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-800 hover:bg-green-200"
                  >
                    Active
                  </Badge>
                  {offer.campaign_type && (
                    <Badge variant="outline">
                      {offer.campaign_type === "single"
                        ? "Single Event"
                        : "Multi Event"}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Offer details content */}
          <div className="grid grid-cols-1 md:grid-cols-1 gap-2 p-6">
            {/* Left column */}
            <div className="space-y-2">
              <div className="flex flex-row gap-2">
                <h3 className="text-sm font-semibold">Date Added:</h3>
                <p className="text-sm text-normal">
                  {formatDate(offer.created_at)}
                </p>
              </div>

              <div className="flex flex-row gap-2">
                <h3 className="text-sm font-semibold">Tracking URL:</h3>
                <p className="text-sm text-normal">
                  {offer?.tracking_url || "No tracking URL available"}
                </p>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() =>
                    copyToClipboard(
                      offer?.tracking_url || "No tracking URL available"
                    )
                  }
                >
                  <Copy size={14} />
                </Button>
              </div>

              <div className="flex flex-row gap-2">
                <h3 className="text-sm font-semibold">Countries</h3>
                <p className="text-sm text-normal">
                  {offer?.country_target_type === "all"
                    ? "Global"
                    : offer?.countries.map((country) => (
                        <span
                          key={country}
                          className="text-muted-foreground mr-1 uppercase"
                        >
                          {country}
                        </span>
                      )) || (
                        <span className="text-muted-foreground">
                          No countries specified
                        </span>
                      )}
                </p>
              </div>

              <div className="flex flex-row gap-2">
                <h3 className="text-sm font-semibold">Devices</h3>
                <p className="text-sm text-normal">
                  {offer?.devices?.length > 0
                    ? offer?.devices.map((device) => (
                        <span
                          key={device}
                          className="text-muted-foreground mr-1 uppercase"
                        >
                          {device}
                        </span>
                      ))
                    : "All devices"}
                </p>
              </div>

              <div className="flex flex-row gap-2">
                <h3 className="text-sm font-semibold">Category</h3>
                <p className="text-sm text-normal capitalize">
                  {offer?.category}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold">Payout</h3>
                <div className="flex items-center gap-2">
                  <span className="text-lg">
                    $
                    {
                      calculateCampaignDistribution(
                        Number(offer?.campaign_payout),
                        Number(offer?.admin_percentage),
                        0,
                      )?.publisherCut
                    }
                  </span>
                  <span className="text-muted-foreground text-sm uppercase">
                    ({offer.payout_type})
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Goals/Events section */}
          {offer?.events_or_action && offer?.events_or_action?.length > 0 && (
            <div className="p-6 border-t">
              <h3 className="text-lg font-semibold mb-2">Offer Events</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {offer?.events_or_action?.map((event, index) => (
                  <div
                    key={event.id}
                    className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">
                        Event Number: #{index + 1}
                      </h4>
                    </div>
                    <p className="">{event?.name}</p>
                    <p className="mb-2">
                      $
                      {offer?.payout_type === "cpi"
                        ? calculateCampaignDistribution(
                            Number(offer?.campaign_payout),
                            Number(offer?.admin_percentage),
                            0,
                          )?.publisherCut
                        : calculateCampaignDistribution(
                            Number(event?.payout),
                            Number(offer?.admin_percentage),
                            0,
                          )?.publisherCut}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => copyToClipboard(event?.token)}
                    >
                      <Copy size={12} className="mr-1" /> Copy Event ID
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
