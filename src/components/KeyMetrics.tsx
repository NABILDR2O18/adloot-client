
import React, { useEffect, useState, useRef } from 'react';
import { Users, CreditCard, Globe, Calendar } from 'lucide-react';
import { useInView } from '@/hooks/use-in-view';

interface MetricProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  delay: number;
}

const Metric: React.FC<MetricProps> = ({ icon, value, label, delay }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref);
  const targetValue = parseInt(value.replace(/[^0-9]/g, ''));
  
  useEffect(() => {
    if (!isInView) return;
    
    const duration = 2000; // 2 seconds
    const startTime = performance.now();
    
    const timer = setTimeout(() => {
      const step = (currentTime: number) => {
        const elapsedTime = currentTime - startTime;
        
        if (elapsedTime < duration) {
          const progress = Math.min(elapsedTime / duration, 1);
          setCount(Math.floor(progress * targetValue));
          requestAnimationFrame(step);
        } else {
          setCount(targetValue);
        }
      };
      
      requestAnimationFrame(step);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [isInView, targetValue, delay]);
  
  const formatter = new Intl.NumberFormat('en-US');
  const displayValue = value.includes('$') 
    ? '$' + formatter.format(count) 
    : (value.includes('M') ? formatter.format(count) + 'M+' : formatter.format(count) + '+');

  return (
    <div 
      ref={ref}
      className="bg-white rounded-xl shadow-lg p-6 text-center transform transition-all duration-500 hover:shadow-xl hover:-translate-y-1"
      style={{ 
        opacity: isInView ? 1 : 0,
        transform: isInView ? 'translateY(0)' : 'translateY(20px)'
      }}
    >
      <div className="flex justify-center mb-4">
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
          {icon}
        </div>
      </div>
      <div className="text-3xl font-bold text-gray-800 mb-2 h-10">
        {isInView ? displayValue : '0'}
      </div>
      <div className="text-gray-600">{label}</div>
    </div>
  );
};

export const KeyMetrics = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
          Delivering <span className="text-purple-600">Results</span> at Scale
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Metric
            icon={<CreditCard className="w-8 h-8" />}
            value="40000+"
            label="Total Payouts"
            delay={0}
          />
          <Metric
            icon={<Users className="w-8 h-8" />}
            value="10000+"
            label="Active Users"
            delay={200}
          />
          <Metric
            icon={<Globe className="w-8 h-8" />}
            value="500+"
            label="Global Campaigns"
            delay={400}
          />
          <Metric
            icon={<Calendar className="w-8 h-8" />}
            value="1200+"
            label="Daily Offers"
            delay={600}
          />
        </div>
      </div>
    </section>
  );
};
