import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import { KeyMetrics } from "@/components/KeyMetrics";
import { SolutionsSection } from "@/components/SolutionsSection";
import ForAdvertisers from "@/components/ForAdvertisers";
import { ForPublishers } from "@/components/ForPublishers";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { CallToAction } from "@/components/CallToAction";
import Footer from "@/components/Footer";

const Index = () => {
  return (
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
  );
};

export default Index;
