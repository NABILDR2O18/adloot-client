import { useRef, useEffect, useState } from "react";
import { useInView } from "@/hooks/use-in-view";
import { Code, BarChart, CreditCard, HelpCircle } from "lucide-react";
import { Button } from "./ui/button";
import { useAuthModal } from "@/contexts/AuthModalContext";
import { useUser } from "@/contexts/UserContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const ForPublishers = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { threshold: 0.2 });
  const [scrollPos, setScrollPos] = useState(0);
  const { openSignup, setUserType } = useAuthModal();
  const { user } = useUser();
  const navigate = useNavigate();

  // Parallax effect on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const offsetTop = rect.top;
      const windowHeight = window.innerHeight;

      if (offsetTop < windowHeight && offsetTop > -rect.height) {
        setScrollPos(offsetTop);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handlePublisherSignup = () => {
    if (user) {
      toast.error("You are already have an account.");
      return;
    }
    setUserType("publisher");
    openSignup();
  };

  const benefits = [
    {
      icon: <Code className="w-6 h-6" />,
      title: "Easy Integration",
      description:
        "Integrate offerwall, API or SDK with just a few lines of code.",
    },
    {
      icon: <BarChart className="w-6 h-6" />,
      title: "Live Dashboard",
      description: "Track your earnings and performance metrics in real-time.",
    },
    {
      icon: <CreditCard className="w-6 h-6" />,
      title: "High Payouts",
      description: "Competitive rates and weekly payments with low thresholds.",
    },
    {
      icon: <HelpCircle className="w-6 h-6" />,
      title: "Dedicated Support",
      description: "Get personalized assistance from our expert support team.",
    },
  ];

  return (
    <section id="publishers" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-16">
          {/* Content */}
          <div
            className="w-full lg:w-1/2"
            style={{
              transform: isInView ? "translateX(0)" : "translateX(-100px)",
              opacity: isInView ? 1 : 0,
              transition:
                "transform 0.8s ease-out 0.2s, opacity 0.8s ease-out 0.2s",
            }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              For <span className="text-purple-600">Publishers</span>
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Maximize your revenue with our publisher solutions. Choose from
              multiple integration methods and enjoy industry-leading payouts
              with timely payments.
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
                onClick={handlePublisherSignup}
              >
                Become a Publisher
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

          {/* Illustration */}
          <div
            ref={containerRef}
            className="w-full lg:w-1/2 relative"
            style={{
              transform: isInView ? "translateX(0)" : "translateX(100px)",
              opacity: isInView ? 1 : 0,
              transition: "transform 0.8s ease-out, opacity 0.8s ease-out",
            }}
          >
            {/* Code implementation demo */}
            <div
              className="bg-gray-900 rounded-xl shadow-xl p-4 text-white font-mono text-sm"
              style={{
                transform: `translateY(${scrollPos * 0.05}px)`,
                transition: "transform 0.1s ease-out",
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
                <div className="text-gray-500 text-xs">integration.js</div>
              </div>

              <div className="text-blue-400">{/* Initialize AdLoot SDK */}</div>
              <pre className="mb-4 whitespace-pre-wrap">
                <span className="text-purple-400">import</span>{" "}
                <span className="text-yellow-300">AdLootSDK</span>{" "}
                <span className="text-purple-400">from</span>{" "}
                <span className="text-green-300">&apos;adloot-sdk&apos;</span>;
                <span className="text-yellow-300">AdLootSDK</span>.
                <span className="text-blue-300">init</span>({`{`}
                <span className="text-green-300">apiKey</span>:{" "}
                <span className="text-yellow-300">
                  &apos;YOUR_API_KEY&apos;
                </span>
                ,<span className="text-green-300">userId</span>:{" "}
                <span className="text-yellow-300">currentUser.id</span>,
                <span className="text-green-300">config</span>: {`{`}
                <span className="text-green-300">theme</span>:{" "}
                <span className="text-yellow-300">&apos;light&apos;</span>,
                <span className="text-green-300">position</span>:{" "}
                <span className="text-yellow-300">
                  &apos;bottom-right&apos;
                </span>
                {`}`}
                {`}`});
              </pre>

              <div className="text-blue-400">{/* Show the offerwall */}</div>
              <pre className="mb-4 whitespace-pre-wrap">
                <span className="text-yellow-300">function</span>{" "}
                <span className="text-blue-300">openOfferwall</span>() {`{`}
                <span className="text-yellow-300">AdLootSDK</span>.
                <span className="text-blue-300">showOfferwall</span>();
                {`}`}
                <span className="text-green-400">// Event listeners</span>
                <span className="text-yellow-300">AdLootSDK</span>.
                <span className="text-blue-300">on</span>(
                <span className="text-green-300">&apos;reward&apos;</span>,{" "}
                <span className="text-purple-300">event</span> =&gt; {`{`}
                <span className="text-blue-300">console</span>.
                <span className="text-blue-300">log</span>(
                <span className="text-green-300">&apos;User earned &apos;</span>{" "}
                + <span className="text-yellow-300">event</span>.
                <span className="text-blue-300">coins</span> +{" "}
                <span className="text-green-300">&apos; coins!&apos;</span>);
                {`}`});
              </pre>

              <div className="text-blue-400">{/* Track earnings */}</div>
              <pre className="whitespace-pre-wrap">
                <span className="text-yellow-300">async function</span>{" "}
                <span className="text-blue-300">getEarnings</span>() {`{`}
                <span className="text-purple-400">const</span>{" "}
                <span className="text-yellow-300">stats</span> ={" "}
                <span className="text-purple-400">await</span>{" "}
                <span className="text-yellow-300">AdLootSDK</span>.
                <span className="text-blue-300">getPublisherStats</span>();
                <span className="text-purple-400">return</span>{" "}
                <span className="text-yellow-300">stats</span>.
                <span className="text-blue-300">totalEarnings</span>;{`}`}
              </pre>
            </div>

            {/* Earnings visualization */}
            <div
              className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-4 w-3/4"
              style={{
                transform: `translateY(${scrollPos * -0.08}px)`,
                transition: "transform 0.1s ease-out",
              }}
            >
              <div className="text-sm font-semibold mb-3">Weekly Earnings</div>
              <div className="h-32">
                <div className="flex items-end h-24 space-x-1">
                  {[30, 45, 35, 55, 70, 60, 80].map((height, i) => (
                    <div key={i} className="flex-1">
                      <div
                        className="bg-gradient-to-t from-purple-500 to-purple-400 rounded-t"
                        style={{ height: `${height}%` }}
                      ></div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <div>Mon</div>
                  <div>Tue</div>
                  <div>Wed</div>
                  <div>Thu</div>
                  <div>Fri</div>
                  <div>Sat</div>
                  <div>Sun</div>
                </div>
              </div>
              <div className="flex justify-between mt-3">
                <div className="text-xs text-gray-500">Total: $1,248.50</div>
                <div className="text-xs text-green-500">
                  ↑ 24% from last week
                </div>
              </div>
            </div>

            {/* Background decoration */}
            <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-gradient-to-br from-purple-300 to-purple-500 rounded-full opacity-10 -z-10"></div>
            <div className="absolute -top-6 -left-6 w-40 h-40 bg-gradient-to-br from-purple-300 to-purple-500 rounded-full opacity-10 -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForPublishers;
