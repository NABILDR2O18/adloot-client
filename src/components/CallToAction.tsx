import toast from "react-hot-toast";
import { Button } from "./ui/button";
import { useAuthModal } from "@/contexts/AuthModalContext";
import { useUser } from "@/contexts/UserContext";
import { useNavigate } from "react-router-dom";
export const CallToAction = () => {
  const { openSignup, setUserType } = useAuthModal();
  const { user } = useUser();
  const navigate = useNavigate();

  const handleAdvertiserSignup = () => {
    if (user) {
      toast.error("You are already have an account.");
      return;
    }
    setUserType("advertiser");
    openSignup();
  };

  const handlePublisherSignup = () => {
    if (user) {
      toast.error("You are already have an account.");
      return;
    }
    setUserType("publisher");
    openSignup();
  };

  return (
    <section className="py-20 bg-gradient-to-br from-purple-600 to-purple-800 text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6">
          Ready to grow with AdLoot?
        </h2>
        <p className="text-xl text-purple-100 mb-10 max-w-2xl mx-auto">
          Join thousands of successful advertisers and publishers and start
          maximizing your revenue today.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {!user ? (
            <>
              <Button
                size="lg"
                className="bg-white text-purple-700 hover:bg-purple-100"
                onClick={handleAdvertiserSignup}
              >
                Register as Advertiser
              </Button>
              <Button
                size="lg"
                className="bg-white text-purple-700 hover:bg-purple-100"
                onClick={handlePublisherSignup}
              >
                Join as Publisher
              </Button>
            </>
          ) : (
            <Button
              size="lg"
              className="bg-white hover:bg-white/90 text-purple-600"
              onClick={() =>
                navigate(
                  user?.role === "admin"
                    ? "/admin/dashboard"
                    : user?.role === "publisher"
                    ? "/publisher/dashboard"
                    : "/advertiser/dashboard"
                )
              }
            >
              Go to dashboard
            </Button>
          )}
        </div>
      </div>
    </section>
  );
};
