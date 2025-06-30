
import { Shield, Zap, DollarSign, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Features = () => {
  const features = [
    {
      icon: <Shield className="h-8 w-8 text-purple-600" />,
      title: "Safe & Secure",
      description: "Industry-leading security measures to protect your earnings",
    },
    {
      icon: <Zap className="h-8 w-8 text-purple-600" />,
      title: "Fast Payments",
      description: "Get paid quickly with our reliable payment system",
    },
    {
      icon: <DollarSign className="h-8 w-8 text-purple-600" />,
      title: "High CPM Rates",
      description: "Competitive rates to maximize your revenue",
    },
    {
      icon: <Users className="h-8 w-8 text-purple-600" />,
      title: "24/7 Support",
      description: "Dedicated team ready to help you succeed",
    },
  ];

  return (
    <section id="features" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Choose Adloot?
          </h2>
          <p className="text-xl text-gray-600">
            We provide the tools and support you need to succeed
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6 text-center">
                <div className="mb-4 flex justify-center">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
