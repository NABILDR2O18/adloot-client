import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, Smartphone, Globe, CheckCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuthModal } from "@/contexts/AuthModalContext";
import { useUser } from "@/contexts/UserContext";
import { CallToAction } from "@/components/CallToAction";

const OfferwallSolution = () => {
  const { openSignup } = useAuthModal();
  const { user } = useUser();
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <div className="pt-32 bg-gradient-to-b from-purple-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Boost Engagement with Our{" "}
              <span className="text-purple-600">Offerwall Solution</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Increase revenue and user engagement with our customizable
              offerwall that seamlessly integrates into your application.
            </p>
            {!user && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                  onClick={openSignup}
                >
                  Get Started Free
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Powerful <span className="text-purple-600">Features</span> for
              Your App
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our offerwall solution provides everything you need to monetize
              your app and improve user experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Customizable Design",
                description:
                  "Match your brand's look and feel with fully customizable designs, colors, and layouts.",
                icon: <Globe className="w-6 h-6 text-purple-600" />,
              },
              {
                title: "Multiple Platforms",
                description:
                  "Deploy on mobile, web, and desktop applications with our cross-platform compatibility.",
                icon: <Smartphone className="w-6 h-6 text-purple-600" />,
              },
              {
                title: "High Converting Offers",
                description:
                  "Access to premium advertisers with high-converting campaigns for maximum revenue.",
                icon: <CheckCircle className="w-6 h-6 text-purple-600" />,
              },
              {
                title: "Real-time Analytics",
                description:
                  "Track performance with real-time reporting and analytics dashboards.",
                icon: <CheckCircle className="w-6 h-6 text-purple-600" />,
              },
              {
                title: "Smart Targeting",
                description:
                  "Show the most relevant offers to users based on demographics and behavior.",
                icon: <CheckCircle className="w-6 h-6 text-purple-600" />,
              },
              {
                title: "Fraud Prevention",
                description:
                  "Advanced fraud detection system ensures quality traffic and legitimate conversions.",
                icon: <CheckCircle className="w-6 h-6 text-purple-600" />,
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-all duration-300"
              >
                <CardContent className="p-6">
                  <div className="flex items-start mb-4">
                    <div className="min-w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Integration Steps */}
      <div className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Easy <span className="text-purple-600">Integration</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get up and running with our offerwall solution in just minutes
              with these simple steps.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-12">
              {[
                {
                  step: 1,
                  title: "Create your account",
                  description:
                    "Sign up for a publisher account on our platform to get started.",
                },
                {
                  step: 2,
                  title: "Configure your offerwall",
                  description:
                    "Customize the appearance and settings of your offerwall in the dashboard.",
                },
                {
                  step: 3,
                  title: "Integrate the Offerwall",
                  description:
                    "Follow our documentation to integrate our lightweight IFrame into your application.",
                },
                {
                  step: 4,
                  title: "Start earning",
                  description:
                    "Launch your offerwall and start generating revenue immediately.",
                },
              ].map((step, index) => (
                <div key={index} className="flex">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                      {step.step}
                    </div>
                  </div>
                  <div className="ml-6">
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <CallToAction />
      <Footer />
    </div>
  );
};

export default OfferwallSolution;
