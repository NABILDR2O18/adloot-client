import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { MouseParallaxBackground } from "./MouseParallaxBackground";
import { useAuthModal } from "@/contexts/AuthModalContext";
import { useUser } from "@/contexts/UserContext";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const [scrollY, setScrollY] = useState(0);
  const { openSignup, setUserType } = useAuthModal();
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAdvertiserSignup = () => {
    setUserType("advertiser");
    openSignup();
  };

  const handlePublisherSignup = () => {
    setUserType("publisher");
    openSignup();
  };

  const opacity = Math.max(0, 1 - scrollY / 350);
  const translateY = scrollY * 0.4;

  return (
    <div className="relative min-h-screen flex items-center overflow-hidden">
      {/* Interactive background animation */}
      <MouseParallaxBackground />

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 relative z-10">
        <div
          className="text-center transition-all duration-300 ease-out"
          style={{
            opacity: opacity,
            transform: `translateY(-${translateY}px)`,
          }}
        >
          <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-8">
            Monetize Smarter.
            <span className="block text-purple-600">
              Advertise Smarter. Grow with AdLoot.
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            The next-gen ad network connecting advertisers with high-converting
            global traffic.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!user ? (
              <>
                <Button
                  size="lg"
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                  onClick={handleAdvertiserSignup}
                >
                  Start Campaign
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-purple-600 text-purple-600 bg-white hover:bg-purple-100 hover:text-purple-600"
                  onClick={handlePublisherSignup}
                >
                  Become a Publisher
                </Button>
              </>
            ) : (
              <Button
                size="lg"
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

      {/* Dashboard illustration that floats in */}
      <div
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-6xl px-4 transition-all duration-1500 ease-out"
        style={{
          transform: `translate(-50%, ${Math.min(
            20,
            scrollY * 0.02
          )}%) scale(${Math.min(1, 0.8 + scrollY / 2000)})`,
          opacity: Math.min(1, scrollY / 800),
          filter: `blur(${Math.max(0, 5 - scrollY / 200)}px)`,
        }}
      >
        <div className="relative w-full bg-white/80 backdrop-blur-sm rounded-t-xl shadow-2xl border border-purple-100">
          <div className="absolute top-0 left-0 right-0 h-8 bg-gray-100 rounded-t-xl flex items-center px-4">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
          </div>
          <div className="pt-12 pb-4 px-4">
            <div className="grid grid-cols-4 gap-4 mb-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="bg-gradient-to-br from-purple-50 to-white rounded-lg p-4 shadow-sm"
                >
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mb-2">
                    <div className="w-4 h-4 rounded-full bg-purple-400"></div>
                  </div>
                  <div className="h-2 bg-gray-200 rounded w-2/3 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                </div>
              ))}
            </div>
            <div className="flex gap-4">
              <div className="w-1/3 bg-gray-50 rounded-lg p-4">
                <div className="h-32 bg-gradient-to-b from-purple-100 to-purple-50 rounded-lg mb-4"></div>
                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="h-2 bg-gray-200 rounded w-full"
                    ></div>
                  ))}
                </div>
              </div>
              <div className="w-2/3 bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-7 gap-2 h-40">
                  {[...Array(7)].map((_, i) => (
                    <div
                      key={i}
                      className="bg-purple-50 rounded-lg flex items-end p-2"
                    >
                      <div
                        className="w-full bg-gradient-to-t from-purple-400 to-purple-300 rounded-t-sm"
                        style={{ height: `${20 + Math.random() * 80}%` }}
                      ></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
