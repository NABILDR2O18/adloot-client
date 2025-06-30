
import { useState } from 'react';
import { Shield, Globe, Workflow, Target, Code } from 'lucide-react';

interface SolutionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const SolutionCard: React.FC<SolutionCardProps> = ({ icon, title, description }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className="bg-white rounded-xl p-6 shadow transition-all duration-300 h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
        boxShadow: isHovered ? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      }}
    >
      <div 
        className={`w-14 h-14 rounded-lg mb-5 flex items-center justify-center transition-all duration-300 ${
          isHovered ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-600'
        }`}
      >
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export const SolutionsSection = () => {
  const solutions = [
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Offerwall",
      description: "Increase engagement and monetization with our customizable offerwall solution.",
    },
    {
      icon: <Code className="w-6 h-6" />,
      title: "SDK Integration",
      description: "Seamlessly integrate our lightweight SDK into your mobile or web applications.",
    },
    {
      icon: <Workflow className="w-6 h-6" />,
      title: "API Solutions",
      description: "Powerful REST API for complete control and deep integration capabilities.",
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Smart Targeting",
      description: "AI-powered targeting for maximum conversion and retention rates.",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Fraud Protection",
      description: "Advanced security measures ensuring quality traffic and legitimate conversions.",
    },
  ];

  return (
    <section id="solutions" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Comprehensive <span className="text-purple-600">Solutions</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Power your business with our suite of advertising and monetization tools built for the modern digital economy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {solutions.map((solution, index) => (
            <SolutionCard
              key={index}
              icon={solution.icon}
              title={solution.title}
              description={solution.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
