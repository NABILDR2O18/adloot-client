import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, ExternalLink } from "lucide-react";
import { toast } from "react-hot-toast";
import { getAppStatusBadge, IApp } from "@/pages/dashboard/MyAppsPage";
import { IAppData } from "@/pages/admin/AppsManagement";

interface AppDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  app: IApp | IAppData | null;
}

export function AppDetailsModal({
  isOpen,
  onClose,
  app,
}: AppDetailsModalProps) {
  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success(message);
      })
      .catch(() => {
        toast.error("Failed to copy to clipboard");
      });
  };
  const wallUrl = app?.api_key
    ? `${import.meta.env.VITE_WALL_URL}/wall?placementID=${
        app?.api_key
      }&sid={USER_ID}`
    : "";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-background text-foreground">
        <DialogHeader className="!max-h-max">
          <DialogTitle className="text-xl font-bold">{app?.name}</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Application details and configuration
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                App URL
              </h3>
              <a
                href={app?.website_url}
                className="mt-1 text-blue-600 dark:text-blue-400 flex items-center gap-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                {app?.website_url} <ExternalLink size={16} />
              </a>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Status
              </h3>
              {getAppStatusBadge(app?.status)}
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Currency Name
              </h3>
              <p className="mt-1">{app?.currency_name_singular}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Conversion Rate
              </h3>
              <p className="mt-1">{app?.conversion_rate} = $1</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Total Earnings
              </h3>
              <p className="mt-1">{""}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Date Added
              </h3>
              <p className="mt-1">
                {new Date(app?.created_at).toLocaleDateString()}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Split to user
              </h3>
              <p className="mt-1">{app?.split_to_user}%</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Description
            </h3>
            <p className="mt-1">{app?.description}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              API Key
            </h3>
            <div className="relative">
              <p className="mt-1 font-mono bg-muted p-3 rounded text-sm overflow-x-auto pr-10">
                {app?.api_key}
              </p>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0"
                onClick={() =>
                  copyToClipboard(app?.api_key, "API key copied to clipboard")
                }
              >
                <Copy size={16} />
              </Button>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Offerwall URL
            </h3>
            <div className="relative">
              <p className="mt-1 font-mono bg-muted p-2 rounded text-sm overflow-x-auto pr-10">
                {wallUrl}
              </p>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0"
                onClick={() =>
                  copyToClipboard(wallUrl, "Offerwall URL copied to clipboard")
                }
              >
                <Copy size={16} />
              </Button>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Postback URL
            </h3>
            <div className="relative">
              <p className="mt-1 font-mono bg-muted p-3 rounded text-sm overflow-x-auto pr-10">
                {app?.postback_url}
              </p>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0"
                onClick={() =>
                  copyToClipboard(
                    app?.postback_url,
                    "Postback URL copied to clipboard"
                  )
                }
              >
                <Copy size={16} />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Replace {"{USER_ID}"} with the user's ID
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
