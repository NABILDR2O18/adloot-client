import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import { KeyMetrics } from "@/components/KeyMetrics";
import { SolutionsSection } from "@/components/SolutionsSection";
import ForAdvertisers from "@/components/ForAdvertisers";
import { ForPublishers } from "@/components/ForPublishers";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { CallToAction } from "@/components/CallToAction";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>AdLoot - Next-Gen Ad Network</title>
        <meta
          name="description"
          content="AdLoot - The next-gen ad network connecting advertisers with high-converting global traffic"
        />
        <meta name="author" content="AdLoot" />
        <meta
          name="keywords"
          content="AdLoot, offerwall, ad network, monetize apps, CPA network, CPI offers, mobile advertising, performance marketing, affiliate marketing, app monetization, reward ads, user acquisition, global traffic, best offerwall for websites, pay-per-install offers, TRC20 payouts, PayPal payouts, Heaven Gamers, advertisers platform, publisher monetization"
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
      </Helmet>
      <div className="min-h-screen bg-white">
        <Navbar />
        <Hero />
        <KeyMetrics />
        <SolutionsSection />
        <ForAdvertisers />
        <ForPublishers />
        <TestimonialsSection />
        <CallToAction />
        <Footer />
      </div>
    </>
  );
};

export default Index;
