import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSettings } from "@/contexts/SettingsContext";
import { Helmet } from "react-helmet-async";

const HelpCenter = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const faqs = [
    {
      question: "How do I create an account?",
      answer:
        "To create an account, click on the 'Sign Up' button in the top right corner of the homepage. Fill out the registration form with your details, and follow the verification steps sent to your email.",
    },
    {
      question: "How do payouts work for publishers?",
      answer: `Publishers can request payouts once their balance reaches the minimum threshold (${settings?.min_withdrawal}). Payouts can be received via PayPal, Payeer or cryptocurrency depending on your location and preferences set in your account.`,
    },
    {
      question: "What kind of targeting options do you offer for advertisers?",
      answer:
        "We offer comprehensive targeting options including geographic location, device type, operating system, connection type, interests, behavioral patterns, and custom audience segments. These can be configured when creating or editing your campaigns.",
    },
    {
      question: "What fraud prevention measures do you have in place?",
      answer:
        "We employ multiple layers of fraud prevention including machine learning algorithms, IP and device fingerprinting, click validation systems, and real-time monitoring of traffic patterns. Our dedicated fraud team also reviews suspicious activities and ensures only legitimate interactions are counted.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Help | AdLoot - Next-Gen Ad Network</title>
        <meta
          name="description"
          content="Help | AdLoot - The next-gen ad network connecting advertisers with high-converting global traffic"
        />
        <meta name="author" content="AdLoot" />
        <meta
          name="keywords"
          content="adLoot Help, adloot, offerwall, ad network, monetize apps, CPA network, CPI offers, mobile advertising, performance marketing, affiliate marketing, app monetization, reward ads, user acquisition, global traffic, best offerwall for websites, pay-per-install offers, TRC20 payouts, PayPal payouts, Heaven Gamers, advertisers platform, publisher monetization"
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
        <link rel="canonical" href="https://adloot.io/help" />
      </Helmet>

      <Navbar />

      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-block p-3 rounded-full bg-purple-100 text-purple-600 mb-4">
              <HelpCircle size={30} />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Help Center
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Find answers to common questions or get in touch with our support
              team.
            </p>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-12">
            {[
              { title: "Getting Started", link: "/" },
              { title: "Publisher Guide", link: "/faq" },
              { title: "Advertiser Guide", link: "/faq" },
              { title: "SDK Integration", link: "/solutions/sdk" },
              { title: "API Documentation", link: "/solutions/api" },
              { title: "Contact Support", link: "/contact" },
            ].map((item, index) => (
              <button
                key={index}
                onClick={() => navigate(item?.link)}
                className="bg-purple-50 hover:bg-purple-100 transition-colors p-4 rounded-lg text-center"
              >
                <span className="text-purple-800 font-medium">
                  {item.title}
                </span>
              </button>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
              Frequently Asked Questions
            </h2>
            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`faq-${index}`}>
                    <AccordionTrigger className="text-left font-medium">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              <div className="text-center mt-8">
                <Button
                  variant="outline"
                  onClick={() => navigate("/faq")}
                  className="border-purple-600 text-purple-600 hover:bg-purple-50"
                >
                  View All FAQs
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HelpCenter;
