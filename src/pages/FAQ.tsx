import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useSettings } from "@/contexts/SettingsContext";

export default function FAQ() {
  const { settings } = useSettings();
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-8 text-center">
            Frequently Asked Questions
          </h1>

          <div className="mb-16">
            <h2 className="text-2xl font-semibold mb-6">For Publishers</h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="p1">
                <AccordionTrigger className="text-left">
                  How do I get started as a publisher?
                </AccordionTrigger>
                <AccordionContent>
                  Getting started is easy. Simply create a publisher account,
                  create app and design your offerwall. Get the IFrame and
                  integrate in your app.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="p2">
                <AccordionTrigger className="text-left">
                  How and when do I get paid?
                </AccordionTrigger>
                <AccordionContent>
                  We offer payouts via PayPal, Payeer, and USDT. (TRC20).
                  Payments are made monthly, provided you've reached the minimum
                  payout threshold of ${settings?.min_withdrawal}.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="p3">
                <AccordionTrigger className="text-left">
                  What types of ads can I display?
                </AccordionTrigger>
                <AccordionContent>
                  Right now, we have only one (default) ad format. experience.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="p4">
                <AccordionTrigger className="text-left">
                  How do you prevent fraud?
                </AccordionTrigger>
                <AccordionContent>
                  We employ advanced fraud detection technologies to identify
                  and filter out invalid traffic, click fraud, and other
                  deceptive practices. This ensures that advertisers get real
                  value and publishers maintain high-quality traffic standards.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div className="mb-16">
            <h2 className="text-2xl font-semibold mb-6">For Advertisers</h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="a1">
                <AccordionTrigger className="text-left">
                  How do I create an advertising campaign?
                </AccordionTrigger>
                <AccordionContent>
                  After creating an advertiser account, you can easily set up
                  campaigns through our dashboard. Define your target audience,
                  set your budget, upload creatives, and launch your campaign.
                  Our platform provides real-time reporting to monitor
                  performance.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="a2">
                <AccordionTrigger className="text-left">
                  What targeting options are available?
                </AccordionTrigger>
                <AccordionContent>
                  Our platform offers comprehensive targeting options including
                  geographic, demographic, device type, interests, and
                  behaviors. You can also create custom audiences and use
                  retargeting to maximize your campaign effectiveness.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="a3">
                <AccordionTrigger className="text-left">
                  What is the minimum ad spend?
                </AccordionTrigger>
                <AccordionContent>
                  Our platform is designed to accommodate businesses of all
                  sizes. You can start with a minimum daily budget of $10, and
                  scale up as you see results. We offer flexible pricing models
                  including CPI, CPA, and CPA.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="a4">
                <AccordionTrigger className="text-left">
                  How do I track campaign performance?
                </AccordionTrigger>
                <AccordionContent>
                  Our dashboard provides comprehensive analytics including
                  impressions, clicks, conversions, and ROI metrics.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-6">Technical Questions</h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="t1">
                <AccordionTrigger className="text-left">
                  Is your SDK compatible with my platform?
                </AccordionTrigger>
                <AccordionContent>
                  We don't provide SDK yet, we have IFrame integration right
                  now.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="t2">
                <AccordionTrigger className="text-left">
                  How do I implement your API?
                </AccordionTrigger>
                <AccordionContent>
                  We don't provide API's yet, we have IFrame integration right
                  now.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="t3">
                <AccordionTrigger className="text-left">
                  Do you comply with privacy regulations?
                </AccordionTrigger>
                <AccordionContent>
                  Yes, we are fully compliant with GDPR, CCPA, and other global
                  privacy regulations. Our platform includes built-in consent
                  management tools to help both publishers and advertisers meet
                  their compliance obligations.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="t4">
                <AccordionTrigger className="text-left">
                  Where can I get technical support?
                </AccordionTrigger>
                <AccordionContent>
                  We offer multiple support channels including email, and a
                  comprehensive knowledge base. Premium support with dedicated
                  account managers is available for enterprise clients.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
