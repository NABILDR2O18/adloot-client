import { useRef } from "react";
import { useInView } from "@/hooks/use-in-view";
import { Target, BarChart, Settings, Shield } from "lucide-react";
import { Button } from "./ui/button";
import { useAuthModal } from "@/contexts/AuthModalContext";
import { useUser } from "@/contexts/UserContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const ForAdvertisers = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { threshold: 0.2 });
  const { openSignup, setUserType } = useAuthModal();
  const { user } = useUser();
  const navigate = useNavigate();
  const benefits = [
    {
      icon: <Target className="w-6 h-6" />,
      title: "Precise Targeting",
      description:
        "Target by GEO, device, platform and more to reach your ideal audience.",
    },
    {
      icon: <BarChart className="w-6 h-6" />,
      title: "Real-time Analytics",
      description:
        "Monitor campaign performance with comprehensive real-time metrics.",
    },
    {
      icon: <Settings className="w-6 h-6" />,
      title: "Budget Management",
      description:
        "Set and adjust budgets on the fly with our flexible campaign tools.",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Fraud Protection",
      description:
        "Advanced fraud detection keeps your campaigns secure and effective.",
    },
  ];

  const handleAdvertiserSignup = () => {
    if (user) {
      toast.error("You are already have an account.");
      return;
    }
    setUserType("advertiser");
    openSignup();
  };

  return (
    <section id="advertisers" className="py-24 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Dashboard Illustration */}
          <div
            ref={containerRef}
            className="w-full lg:w-1/2 relative"
            style={{
              transform: isInView ? "translateX(0)" : "translateX(-100px)",
              opacity: isInView ? 1 : 0,
              transition: "transform 0.8s ease-out, opacity 0.8s ease-out",
            }}
          >
            <div className="bg-white rounded-xl shadow-xl p-6 relative z-10">
              <div className="h-8 bg-gray-100 rounded-t-lg mb-6 flex items-center px-4">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
              </div>

              {/* Campaign dashboard mockup */}
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">
                      Impressions
                    </div>
                    <div className="text-xl font-bold">1.2M</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Clicks</div>
                    <div className="text-xl font-bold">84.5K</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">
                      Conversions
                    </div>
                    <div className="text-xl font-bold">12.3K</div>
                  </div>
                </div>

                {/* Chart area */}
                <div className="bg-white border rounded-lg p-4 h-48">
                  <div className="text-sm font-medium mb-4">
                    Campaign Performance
                  </div>
                  <div className="flex items-end h-28 space-x-2">
                    {[40, 65, 50, 80, 60, 85, 70].map((height, i) => (
                      <div
                        key={i}
                        className="flex-1 flex flex-col items-center"
                      >
                        <div
                          className="w-full bg-purple-500 rounded-t"
                          style={{ height: `${height}%` }}
                        ></div>
                        <div className="text-xs text-gray-500 mt-1">
                          {i + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Targeting options */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm font-medium mb-2">
                      GEO Targeting
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <div className="px-2 py-1 bg-purple-100 rounded text-xs">
                        US
                      </div>
                      <div className="px-2 py-1 bg-purple-100 rounded text-xs">
                        CA
                      </div>
                      <div className="px-2 py-1 bg-purple-100 rounded text-xs">
                        UK
                      </div>
                      <div className="px-2 py-1 bg-purple-100 rounded text-xs">
                        AU
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm font-medium mb-2">
                      Device Targeting
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <div className="px-2 py-1 bg-purple-100 rounded text-xs">
                        iOS
                      </div>
                      <div className="px-2 py-1 bg-purple-100 rounded text-xs">
                        Android
                      </div>
                      <div className="px-2 py-1 bg-purple-100 rounded text-xs">
                        Desktop
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Background decoration */}
            <div className="absolute -bottom-6 -right-6 w-64 h-64 bg-gradient-to-br from-purple-300 to-purple-500 rounded-full opacity-20 -z-10"></div>
            <div className="absolute -top-8 -left-8 w-40 h-40 bg-gradient-to-br from-purple-300 to-purple-500 rounded-full opacity-10 -z-10"></div>
          </div>

          {/* Content */}
          <div
            className="w-full lg:w-1/2"
            style={{
              transform: isInView ? "translateX(0)" : "translateX(100px)",
              opacity: isInView ? 1 : 0,
              transition:
                "transform 0.8s ease-out 0.2s, opacity 0.8s ease-out 0.2s",
            }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              For <span className="text-purple-600">Advertisers</span>
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Launch powerful CPI/CPA/CPE campaigns with advanced targeting
              capabilities designed to maximize your ROI. Get full control over
              your campaigns with our comprehensive toolset.
            </p>

            <div className="space-y-6 mb-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start">
                  <div className="mt-1 bg-purple-100 p-2 rounded-lg text-purple-600 mr-4">
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
            {!user ? (
              <Button
                className="bg-purple-600 hover:bg-purple-700 text-white"
                onClick={handleAdvertiserSignup}
              >
                Start a Campaign
              </Button>
            ) : (
              <Button
                className="bg-purple-600 hover:bg-purple-700 text-white"
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
      </div>
    </section>
  );
};

export default ForAdvertisers;
