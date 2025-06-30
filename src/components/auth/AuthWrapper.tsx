
import { TooltipProvider } from "@/components/ui/tooltip";
import LoginModal from "./LoginModal";
import SignupModal from "./SignupModal";

export default function AuthWrapper() {
  return (
    <TooltipProvider>
      <LoginModal />
      <SignupModal />
    </TooltipProvider>
  );
}
