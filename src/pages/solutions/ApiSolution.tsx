import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChevronRight,
  Code,
  Server,
  Database,
  Shield,
  Globe,
  CheckCircle,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuthModal } from "@/contexts/AuthModalContext";
import ComingSoon from "../docs/ComingSoon";

const ApiSolution = () => {
  const { openSignup } = useAuthModal();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <ComingSoon />
      {/* <div className="pt-32 pb-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Powerful <span className="text-purple-600">API Solutions</span>{" "}
              for Custom Integration
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Our comprehensive REST API enables complete control and deep
              integration capabilities for your applications.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-purple-600 hover:bg-purple-700 text-white"
                onClick={openSignup}
              >
                Get API Access
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-purple-600 text-purple-600 hover:bg-purple-50"
              >
                API Documentation
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              API <span className="text-purple-600">Features</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Build custom solutions with our feature-rich API that gives you
              full control over monetization.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Comprehensive Endpoints",
                description:
                  "Access to all platform features through well-documented API endpoints.",
                icon: <Globe className="w-6 h-6 text-purple-600" />,
              },
              {
                title: "Secure Authentication",
                description:
                  "OAuth 2.0 and API key authentication to keep your data secure.",
                icon: <Shield className="w-6 h-6 text-purple-600" />,
              },
              {
                title: "Real-time Data",
                description:
                  "Get real-time metrics and performance data through API requests.",
                icon: <Database className="w-6 h-6 text-purple-600" />,
              },
              {
                title: "Webhook Integration",
                description:
                  "Set up webhooks to receive real-time notifications about important events.",
                icon: <Server className="w-6 h-6 text-purple-600" />,
              },
              {
                title: "Rate Limits",
                description:
                  "Generous rate limits to support high-volume applications.",
                icon: <Code className="w-6 h-6 text-purple-600" />,
              },
              {
                title: "Extensive Documentation",
                description:
                  "Detailed documentation and examples to help you implement quickly.",
                icon: <Code className="w-6 h-6 text-purple-600" />,
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-all duration-300"
              >
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <div className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Simple API <span className="text-purple-600">Requests</span>
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Our RESTful API is easy to use with any programming language.
              </p>
            </div>

            <div className="mb-10">
              <h3 className="text-lg font-semibold mb-4">
                Get Campaign Performance
              </h3>
              <div className="bg-gray-900 rounded-lg p-4 shadow-lg">
                <pre className="text-green-400 text-sm overflow-x-auto">
                  {`// API Request
curl -X GET "https://api.adnetwork.com/v1/campaigns/12345/performance" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"

// Response
{
  "campaign_id": "12345",
  "name": "Summer Promotion",
  "impressions": 125000,
  "clicks": 3500,
  "conversions": 780,
  "revenue": 2340.50,
  "ctr": 2.8,
  "cvr": 22.3,
  "performance_by_day": [
    { "date": "2023-06-01", "impressions": 12500, "clicks": 350, "conversions": 78 },
    { "date": "2023-06-02", "impressions": 13200, "clicks": 370, "conversions": 82 },
    // Additional days...
  ]
}`}
                </pre>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">
                Create a New Offerwall
              </h3>
              <div className="bg-gray-900 rounded-lg p-4 shadow-lg">
                <pre className="text-green-400 text-sm overflow-x-auto">
                  {`// API Request
curl -X POST "https://api.adnetwork.com/v1/offerwalls" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Game Coins Offerwall",
    "app_id": "app-12345",
    "theme": {
      "primary_color": "#6D28D9",
      "secondary_color": "#4C1D95",
      "text_color": "#1F2937"
    },
    "settings": {
      "reward_currency": "coins",
      "conversion_rate": 10,
      "min_payout": 100
    }
  }'

// Response
{
  "offerwall_id": "off-78901",
  "name": "Game Coins Offerwall",
  "status": "active",
  "created_at": "2023-06-15T14:30:00Z",
  "app_id": "app-12345",
  "integration_code": "<!-- Copy this code to your app -->\\n<script src=\\"https://cdn.adnetwork.com/offerwall.js\\" data-id=\\"off-78901\\"></script>"
}`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              API <span className="text-purple-600">Use Cases</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover how our API can help solve complex integration needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "Custom Monetization Flows",
                description:
                  "Create unique monetization experiences tailored to your user journey.",
                items: [
                  "Build custom reward mechanics",
                  "Integrate with your virtual economy",
                  "Create tiered reward structures",
                ],
              },
              {
                title: "Advanced Reporting",
                description:
                  "Pull detailed analytics into your own dashboards and business intelligence tools.",
                items: [
                  "Scheduled performance reports",
                  "Custom KPI tracking",
                  "User segment analysis",
                ],
              },
              {
                title: "Platform Integration",
                description:
                  "Integrate with your existing tech stack and third-party services.",
                items: [
                  "CRM system integration",
                  "Payment processor connections",
                  "User management systems",
                ],
              },
              {
                title: "Automated Campaign Management",
                description:
                  "Build tools to automatically optimize campaign performance.",
                items: [
                  "Algorithmic budget allocation",
                  "Performance-based campaign adjustments",
                  "A/B testing frameworks",
                ],
              },
            ].map((useCase, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-all duration-300"
              >
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">
                    {useCase.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{useCase.description}</p>
                  <ul className="space-y-2">
                    {useCase.items.map((item, i) => (
                      <li key={i} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <div className="py-24 bg-purple-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Dedicated API Support</h2>
            <p className="text-xl mb-8 text-purple-100">
              Our team of API experts is available to help you with integration
              challenges and custom solutions.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: "Documentation",
                  description:
                    "Comprehensive API documentation with examples in multiple languages.",
                },
                {
                  title: "Developer Support",
                  description:
                    "Direct access to our API engineering team for technical questions.",
                },
                {
                  title: "Integration Consulting",
                  description:
                    "Custom integration planning and architecture reviews.",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm p-6 rounded-lg"
                >
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-purple-100">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Ready to build with our API?
            </h2>
            <p className="text-xl mb-8 text-gray-600">
              Get API credentials and start integrating today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-purple-600 hover:bg-purple-700 text-white"
                onClick={openSignup}
              >
                Get API Access
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-purple-600 text-purple-600 hover:bg-purple-50"
              >
                View API Docs
              </Button>
            </div>
          </div>
        </div>
      </div> */}

      <Footer />
    </div>
  );
};

export default ApiSolution;
