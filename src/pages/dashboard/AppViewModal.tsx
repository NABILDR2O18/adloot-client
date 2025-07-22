import { Dialog, DialogContent } from "@/components/ui/dialog";
import { IAppData } from "../admin/AppsManagement";
import { IApp } from "./MyAppsPage";
import { useUser } from "@/contexts/UserContext";

interface AppViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  app: IApp | IAppData | null;
}

export default function AppViewModal({
  isOpen,
  onClose,
  app,
}: AppViewModalProps) {
  const { user } = useUser();
  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="w-[90%] h-screen max-w-none p-0">
        <iframe
          title="Adloot Offer Wall"
          allow="clipboard-write"
          src={`${import.meta.env.VITE_BASE_URL}/wall/?placementID=${
            app?.api_key
          }&sid=${user?.id}`}
          className="w-full h-full"
        />
      </DialogContent>
    </Dialog>
  );
}
