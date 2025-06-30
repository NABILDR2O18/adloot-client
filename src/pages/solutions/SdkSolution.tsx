import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChevronRight,
  Smartphone,
  Code,
  CheckCircle,
  DownloadCloud,
  FileCode,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuthModal } from "@/contexts/AuthModalContext";
import ComingSoon from "../docs/ComingSoon";

const SdkSolution = () => {
  const { openSignup } = useAuthModal();

  return (
    <div>
      <Navbar />
      <ComingSoon />
      {/* <div className="pt-32 pb-16 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Powerful <span className="text-purple-600">SDK Integration</span>{" "}
              for Mobile Apps
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Our lightweight SDK makes it easy to integrate offerwalls,
              rewarded ads, and more into your mobile applications.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-purple-600 hover:bg-purple-700 text-white"
                onClick={openSignup}
              >
                Get Started Free
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-purple-600 text-purple-600 hover:bg-purple-50"
              >
                View Documentation
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Support for All{" "}
              <span className="text-purple-600">Major Platforms</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our SDK supports iOS, Android, Unity, and React Native, making
              integration simple across all platforms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                platform: "iOS",
                description:
                  "Native iOS SDK for Swift and Objective-C applications.",
                icon: <Code className="w-6 h-6 text-purple-600" />,
              },
              {
                platform: "Android",
                description:
                  "Kotlin and Java support for Android applications.",
                icon: <Smartphone className="w-6 h-6 text-purple-600" />,
              },
              {
                platform: "Unity",
                description: "C# integration for Unity game development.",
                icon: <FileCode className="w-6 h-6 text-purple-600" />,
              },
              {
                platform: "React Native",
                description: "JavaScript SDK for React Native apps.",
                icon: <Code className="w-6 h-6 text-purple-600" />,
              },
            ].map((platform, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-all duration-300"
              >
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                    {platform.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {platform.platform}
                  </h3>
                  <p className="text-gray-600">{platform.description}</p>
                  <Button variant="link" className="mt-4 text-purple-600">
                    View Docs <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <div className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Key <span className="text-purple-600">Features</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our SDK is packed with features to help you implement monetization
              solutions easily.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Lightweight Design",
                description:
                  "Minimal impact on app size and performance with our optimized codebase.",
              },
              {
                title: "Easy Implementation",
                description:
                  "Integration in minutes with just a few lines of code.",
              },
              {
                title: "Customizable UI",
                description:
                  "Flexible UI components that adapt to your app's design.",
              },
              {
                title: "Analytics Integration",
                description:
                  "Built-in analytics to track performance and user behavior.",
              },
              {
                title: "Caching System",
                description:
                  "Smart caching to reduce load times and bandwidth usage.",
              },
              {
                title: "Offline Support",
                description:
                  "Graceful handling of offline scenarios with data synchronization.",
              },
            ].map((feature, index) => (
              <div key={index} className="flex">
                <div className="flex-shrink-0">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Simple <span className="text-purple-600">Implementation</span>
              </h2>
              <p className="text-xl text-gray-600">
                Just a few lines of code to integrate our SDK into your
                application.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Android Implementation
                </h3>
                <div className="bg-gray-900 rounded-lg p-4 shadow-lg">
                  <pre className="text-green-400 text-sm overflow-x-auto">
                    {`// Initialize the SDK
AdNetworkSDK.initialize(context, "YOUR_API_KEY");

// Show the offerwall
findViewById(R.id.offerwall_button)
    .setOnClickListener(v -> {
        AdNetworkSDK.showOfferwall();
    });

// Track reward completion
AdNetworkSDK.setRewardListener(new RewardListener() {
    @Override
    public void onRewardComplete(int amount) {
        // Give rewards to user
        userWallet.addCoins(amount);
    }
});`}
                  </pre>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">
                  iOS Implementation
                </h3>
                <div className="bg-gray-900 rounded-lg p-4 shadow-lg">
                  <pre className="text-green-400 text-sm overflow-x-auto">
                    {`// Initialize the SDK
AdNetworkSDK.initialize(withApiKey: "YOUR_API_KEY")

// Show the offerwall
@IBAction func showOfferwall(_ sender: UIButton) {
    AdNetworkSDK.showOfferwall()
}

// Track reward completion
AdNetworkSDK.setRewardListener { amount in
    // Give rewards to user
    UserWallet.shared.addCoins(amount)
}`}
                  </pre>
                </div>
              </div>
            </div>

            <div className="mt-12 text-center">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                <DownloadCloud className="w-5 h-5 mr-2" /> Download Sample
                Projects
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="py-24 bg-purple-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-purple-200 mb-6">"</div>
            <p className="text-xl md:text-2xl mb-8">
              Implementing the SDK into our game was incredibly simple. Their
              documentation is clear, and the integration was seamless. Within
              days, we saw a significant increase in revenue without any
              negative impact on our user experience.
            </p>
            <div className="flex items-center justify-center">
              <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                <img
                  src="https://randomuser.me/api/portraits/men/32.jpg"
                  alt="Developer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-left">
                <div className="font-semibold">Michael Thompson</div>
                <div className="text-purple-200 text-sm">
                  Lead Developer, GameStart Studios
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Ready to integrate our SDK?
            </h2>
            <p className="text-xl mb-8 text-gray-600">
              Get started today and see how easy it is to implement our
              monetization solutions into your app.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-purple-600 hover:bg-purple-700 text-white"
                onClick={openSignup}
              >
                Get Started Free
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-purple-600 text-purple-600 hover:bg-purple-50"
              >
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </div> */}
      <Footer />
    </div>
  );
};

export default SdkSolution;
