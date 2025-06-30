import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Shield, Check, AlertTriangle } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { useAuthModal } from "@/contexts/AuthModalContext";

const FraudProtection = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const { openSignup, setUserType } = useAuthModal();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-block p-4 rounded-full bg-purple-100 text-purple-600 mb-4">
              <Shield size={40} />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Fraud Protection
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Protect your ad spend with our advanced fraud detection and
              prevention system, ensuring legitimate traffic and real
              engagement.
            </p>
          </div>

          {/* Key Features */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">
              Advanced Fraud Protection Features
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Real-time Monitoring",
                  description:
                    "Continuous monitoring of all traffic sources and user activities to detect suspicious patterns instantly.",
                  icon: <AlertTriangle className="h-8 w-8 text-purple-600" />,
                },
                {
                  title: "Machine Learning Detection",
                  description:
                    "AI-powered algorithms that continuously learn and adapt to identify new fraud techniques and methods.",
                  icon: <Shield className="h-8 w-8 text-purple-600" />,
                },
                {
                  title: "IP and Device Fingerprinting",
                  description:
                    "Sophisticated tracking of user devices and IP addresses to prevent duplicate conversions and fraud attempts.",
                  icon: <Shield className="h-8 w-8 text-purple-600" />,
                },
                {
                  title: "Click Validation",
                  description:
                    "Multi-layer verification process to ensure clicks are from legitimate users with genuine interest.",
                  icon: <Check className="h-8 w-8 text-purple-600" />,
                },
                {
                  title: "Bot Traffic Filtering",
                  description:
                    "Advanced systems to identify and filter out bot traffic, ensuring only human interactions are counted.",
                  icon: <Shield className="h-8 w-8 text-purple-600" />,
                },
                {
                  title: "Conversion Verification",
                  description:
                    "Post-click analysis to verify that conversions meet all required quality parameters.",
                  icon: <Check className="h-8 w-8 text-purple-600" />,
                },
              ].map((feature, index) => (
                <Card
                  key={index}
                  className="p-6 border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="h-12 w-12 flex items-center justify-center rounded-md bg-purple-100 mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* How It Works */}
          <div className="mb-16 bg-gray-50 rounded-xl p-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">
              How Our Fraud Protection Works
            </h2>
            <div className="relative">
              {/* Timeline Line */}
              <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-purple-200"></div>

              {/* Timeline Items */}
              <div className="space-y-8 md:space-y-0">
                {[
                  {
                    title: "Traffic Monitoring",
                    description:
                      "All incoming traffic is continuously monitored for volume, patterns, and anomalies.",
                    position: "left",
                  },
                  {
                    title: "Data Analysis",
                    description:
                      "Our ML algorithms analyze multiple data points including IP, device, time patterns, and user behavior.",
                    position: "right",
                  },
                  {
                    title: "Risk Assessment",
                    description:
                      "Each interaction is assigned a risk score based on combined signals and historical patterns.",
                    position: "left",
                  },
                  {
                    title: "Fraud Filtering",
                    description:
                      "High-risk activity is automatically filtered out before it affects your campaigns.",
                    position: "right",
                  },
                  {
                    title: "Reporting & Transparency",
                    description:
                      "Detailed reports show what was blocked and why, giving you full visibility into protection activities.",
                    position: "left",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="relative flex items-start md:items-center mb-8"
                  >
                    <div
                      className={`md:w-1/2 ${
                        item.position === "right" ? "md:ml-auto" : ""
                      } ${
                        item.position === "right" ? "md:pl-10" : "md:pr-10"
                      } md:text-${item.position}`}
                    >
                      <Card className="p-6 bg-white shadow">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          Step {index + 1}: {item.title}
                        </h3>
                        <p className="text-gray-600">{item.description}</p>
                      </Card>
                    </div>

                    {/* Timeline Dot */}
                    <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-purple-500 border-4 border-purple-100"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">
              The Benefits of AdLoot Fraud Protection
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="p-6 border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  For Advertisers
                </h3>
                <ul className="space-y-3">
                  {[
                    "Maximize ROI by ensuring ad spend only goes to legitimate traffic",
                    "Protect brand reputation by avoiding association with fraudulent sources",
                    "Gain accurate campaign performance insights based on real user data",
                    "Reduce wasted budget on fake clicks and conversions",
                    "Access detailed fraud reports and analysis",
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 text-green-600">
                        <Check size={16} />
                      </div>
                      <span className="ml-2 text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              <Card className="p-6 border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  For Publishers
                </h3>
                <ul className="space-y-3">
                  {[
                    "Build trust with advertisers by delivering verified high-quality traffic",
                    "Protect your platform from fraudulent users and activities",
                    "Increase value of your inventory with certified fraud protection",
                    "Avoid revenue clawbacks due to fraudulent traffic detection",
                    "Gain insights into traffic quality and user behavior",
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 text-green-600">
                        <Check size={16} />
                      </div>
                      <span className="ml-2 text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </div>

          {/* Call To Action */}
          <div className="bg-purple-600 rounded-xl p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Protect Your Ad Spend?
            </h2>
            <p className="text-purple-100 mb-8 max-w-2xl mx-auto">
              Don't let fraud drain your advertising budget. Implement our
              advanced protection system today and ensure every dollar spent
              delivers real value.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!user ? (
                <>
                  <Button
                    size="lg"
                    className="bg-white text-purple-600 hover:bg-gray-100"
                    onClick={() => {
                      setUserType("advertiser");
                      openSignup();
                    }}
                  >
                    Start Campaign
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-purple-800 text-white hover:bg-purple-900"
                    onClick={() => {
                      setUserType("publisher");
                      openSignup();
                    }}
                  >
                    Become a Publisher
                  </Button>
                </>
              ) : (
                <Button
                  size="lg"
                  className="bg-purple-800 text-white hover:bg-purple-900"
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
      </main>

      <Footer />
    </div>
  );
};

export default FraudProtection;
