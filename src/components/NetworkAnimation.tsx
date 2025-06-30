
import React from 'react';
import { Network, Link } from 'lucide-react';

const NetworkAnimation = () => {
  return (
    <div className="absolute inset-0 overflow-hidden -z-10">
      {/* Network nodes */}
      <div className="absolute w-full h-full">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-pulse"
            style={{
              left: `${Math.random() * 80 + 10}%`,
              top: `${Math.random() * 80 + 10}%`,
              animationDelay: `${Math.random() * 3}s`,
              transform: `scale(${Math.random() * 0.5 + 0.5})`,
            }}
          >
            {i % 2 === 0 ? (
              <Network className="text-purple-400/40 w-8 h-8" />
            ) : (
              <Link className="text-purple-400/40 w-6 h-6" />
            )}
          </div>
        ))}
      </div>
      
      {/* Animated connection lines */}
      <div className="absolute w-full h-full">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute h-px bg-gradient-to-r from-purple-400/0 via-purple-400/30 to-purple-400/0 animate-network-flow"
            style={{
              left: '0',
              top: `${Math.random() * 100}%`,
              width: '100%',
              transform: `rotate(${Math.random() * 180}deg)`,
              transformOrigin: 'center',
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Floating orbs */}
      <div className="absolute w-full h-full">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              backgroundColor: 'rgba(168, 85, 247, 0.2)',
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${Math.random() * 4 + 4}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default NetworkAnimation;
