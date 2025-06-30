
import { useUser } from "@/contexts/UserContext";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function ScrollToTop() {
  const { pathname } = useLocation();
  const {authRole} = useUser();
  const [lastShowsToastTime, setLastShowsToastTime] = useState<number>(0);
  
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth" // Add smooth scrolling behavior
    });
    if (authRole === 'pending') {
      // just check for 5 seconds
      if (lastShowsToastTime === 0) {
        toast.error('Please wait while we verify your account...');
        setLastShowsToastTime(Date.now());
      } else if (Date.now() - lastShowsToastTime > 5000) {
        toast.error('Please wait while we verify your account...');
        setLastShowsToastTime(Date.now());
      }
    }
  }, [pathname]);
  
  return null;
}
