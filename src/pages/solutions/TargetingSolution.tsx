import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChevronRight,
  Target,
  Users,
  LineChart,
  MapPin,
  Brain,
  CheckCircle,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuthModal } from "@/contexts/AuthModalContext";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { CallToAction } from "@/components/CallToAction";
import { Helmet } from "react-helmet-async";

const TargetingSolution = () => {
  const { openSignup } = useAuthModal();
  const { user } = useUser();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Smart Targeting | AdLoot - Next-Gen Ad Network</title>
        <meta
          name="description"
          content="Smart Targeting | AdLoot - The next-gen ad network connecting advertisers with high-converting global traffic"
        />
        <meta name="author" content="AdLoot" />
        <meta
          name="keywords"
          content="adLoot Smart Targeting, adloot, offerwall, ad network, monetize apps, CPA network, CPI offers, mobile advertising, performance marketing, affiliate marketing, app monetization, reward ads, user acquisition, global traffic, best offerwall for websites, pay-per-install offers, TRC20 payouts, PayPal payouts, Heaven Gamers, advertisers platform, publisher monetization"
        />

        <meta property="og:title" content="AdLoot - Next-Gen Ad Network" />
        <meta
          property="og:description"
          content="The next-gen ad network connecting advertisers with high-converting global traffic"
        />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://adloot.io/thumbnail.jpeg" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@adloot" />
        <meta name="twitter:image" content="https://adloot.io/thumbnail.jpeg" />
        <link rel="canonical" href="https://adloot.io/solutions/targeting" />
      </Helmet>
      
      <Navbar />
      {/* Hero Section */}
      <div className="pt-32 pb-16 bg-gradient-to-b from-purple-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Precision <span className="text-purple-600">Targeting</span> for
              Maximum Results
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Our AI-powered targeting solution delivers the right offers to the
              right users at the right time, maximizing conversion rates and
              ROI.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!user ? (
                <Button
                  size="lg"
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                  onClick={openSignup}
                >
                  Get Started Free
                </Button>
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
      </div>

      {/* Key Benefits */}
      <div className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Key <span className="text-purple-600">Benefits</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our targeting solution helps advertisers reach ideal audiences and
              publishers maximize revenue.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Higher Conversion Rates",
                description:
                  "Increase conversions by up to 300% with AI-powered user matching.",
                icon: <Target className="w-6 h-6 text-purple-600" />,
              },
              {
                title: "Better User Experience",
                description:
                  "Show relevant offers that users actually want to engage with.",
                icon: <Users className="w-6 h-6 text-purple-600" />,
              },
              {
                title: "Increased Revenue",
                description:
                  "Maximize earnings per user through optimized offer selection.",
                icon: <LineChart className="w-6 h-6 text-purple-600" />,
              },
              {
                title: "Geographic Precision",
                description:
                  "Target users by country, region, city or even radius around locations.",
                icon: <MapPin className="w-6 h-6 text-purple-600" />,
              },
              {
                title: "Behavioral Targeting",
                description:
                  "Match offers based on user interests and in-app behavior.",
                icon: <Brain className="w-6 h-6 text-purple-600" />,
              },
              {
                title: "Continuous Optimization",
                description:
                  "Our AI continuously learns and improves performance over time.",
                icon: <Brain className="w-6 h-6 text-purple-600" />,
              },
            ].map((benefit, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-all duration-300"
              >
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    {benefit.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How Our <span className="text-purple-600">Targeting Works</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our advanced targeting system uses multiple data points to deliver
              the perfect match between users and offers.
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="relative">
              {/* Connection lines */}
              <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 transform -translate-x-1/2 z-0"></div>

              {[
                {
                  title: "Data Collection",
                  description:
                    "Our system collects anonymous user data including demographics, interests, and behaviors while respecting privacy.",
                  align: "right",
                },
                {
                  title: "AI Processing",
                  description:
                    "Our machine learning algorithms analyze patterns to identify the best offers for each user segment.",
                  align: "left",
                },
                {
                  title: "Real-time Matching",
                  description:
                    "When a user opens the offerwall, our system instantly matches them with the most relevant offers.",
                  align: "right",
                },
                {
                  title: "Continuous Learning",
                  description:
                    "The system learns from each interaction to improve matching accuracy over time.",
                  align: "left",
                },
                {
                  title: "Performance Analytics",
                  description:
                    "Detailed reporting shows which segments perform best for different campaigns.",
                  align: "right",
                },
              ].map((step, index) => (
                <div
                  key={index}
                  className="relative z-10 mb-12 flex items-center"
                >
                  <div
                    className={`lg:w-1/2 ${
                      step.align === "left" ? "lg:pr-16 ml-auto" : "lg:pl-16"
                    }`}
                  >
                    <div
                      className={`bg-white p-6 rounded-lg shadow-lg ${
                        step.align === "left" ? "lg:text-right" : ""
                      }`}
                    >
                      <div
                        className={`flex items-center mb-3 ${
                          step.align === "left"
                            ? "lg:flex-row-reverse justify-start"
                            : ""
                        }`}
                      >
                        <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                          {index + 1}
                        </div>
                        <h3
                          className={`text-xl font-semibold ${
                            step.align === "left" ? "lg:mr-3" : "ml-3"
                          }`}
                        >
                          {step.title}
                        </h3>
                      </div>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="py-24 bg-purple-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Real Results from Smart Targeting
            </h2>
            <p className="text-xl text-purple-100 max-w-3xl mx-auto">
              Our clients have seen remarkable improvements after implementing
              our targeting solution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                metric: "250%",
                description: "Average increase in conversion rates",
              },
              {
                metric: "185%",
                description: "Increase in publisher revenue",
              },
              {
                metric: "43%",
                description: "Reduction in cost per acquisition",
              },
            ].map((stat, index) => (
              <div
                key={index}
                className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-lg"
              >
                <div className="text-4xl font-bold text-white mb-2">
                  {stat.metric}
                </div>
                <p className="text-purple-100">{stat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Targeting Options */}
      <div className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Advanced{" "}
              <span className="text-purple-600">Targeting Options</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Fine-tune your campaigns with our comprehensive targeting
              capabilities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-12 gap-x-16 max-w-5xl mx-auto">
            {[
              {
                category: "Demographic",
                options: [
                  "Age groups",
                  "Gender",
                  "Income level",
                  "Education",
                  "Occupation",
                ],
              },
              {
                category: "Geographic",
                options: [
                  "Country",
                  "Region/State",
                  "City",
                  "ZIP/Postal code",
                  "Radius targeting",
                ],
              },
              {
                category: "Behavioral",
                options: [
                  "App usage patterns",
                  "Purchase history",
                  "Engagement levels",
                  "Time spent in app",
                ],
              },
              {
                category: "Device & Technical",
                options: [
                  "Device type",
                  "Operating system",
                  "Connection type",
                  "Carrier",
                ],
              },
              {
                category: "Custom Segments",
                options: [
                  "Create custom user segments",
                  "Lookalike audiences",
                  "Retargeting groups",
                ],
              },
              {
                category: "Advanced Rules",
                options: [
                  "Frequency caps",
                  "Day parting",
                  "Sequential targeting",
                  "A/B testing",
                ],
              },
            ].map((category, index) => (
              <div key={index}>
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Target className="w-5 h-5 text-purple-600 mr-2" />
                  {category.category} Targeting
                </h3>
                <ul className="space-y-2">
                  {category.options.map((option, i) => (
                    <li key={i} className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                      <span>{option}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      <CallToAction />
      <Footer />
    </div>
  );
};

export default TargetingSolution;
