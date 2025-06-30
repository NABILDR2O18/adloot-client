
import React, { useEffect, useRef, useState } from 'react';

interface ParticleProps {
  x: number;
  y: number;
  size: number;
  color: string;
  depth: number;
  enableMouseTracking: boolean;
}

export const MouseParallaxBackground: React.FC = () => {
  const [particles, setParticles] = useState<ParticleProps[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const enableMouseTracking = true; // Set to false to disable mouse tracking

  // Generate initial particles
  useEffect(() => {
    const newParticles: ParticleProps[] = [];
    const count = Math.floor(window.innerWidth / 30); // Responsive particle count

    for (let i = 0; i < count; i++) {
      newParticles.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 2 + Math.random() * 8,
        color: `rgba(${128 + Math.random() * 70}, ${50 + Math.random() * 50}, ${200 + Math.random() * 55}, ${0.1 + Math.random() * 0.3})`,
        depth: 0.1 + Math.random() * 0.9,
        enableMouseTracking: enableMouseTracking,
      });
    }
    setParticles(newParticles);
  }, []);

  // Track mouse position
  useEffect(() => {
    if (!enableMouseTracking) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setMousePosition({
        x: ((e.clientX - rect.left) / rect.width) * 2 - 1,
        y: ((e.clientY - rect.top) / rect.height) * 2 - 1,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [enableMouseTracking]);

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 overflow-hidden -z-10 bg-gradient-to-br from-white to-purple-50"
    >
      {particles.map((particle, index) => {
        // Calculate position with mouse influence
        const mouseInfluence = particle.enableMouseTracking ? particle.depth * 20 : 0;
        const xPos = `${particle.x + (mousePosition.x * mouseInfluence)}%`;
        const yPos = `${particle.y + (mousePosition.y * mouseInfluence)}%`;
        
        return (
          <div
            key={index}
            className="absolute rounded-full animate-pulse"
            style={{
              left: xPos,
              top: yPos,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              backgroundColor: particle.color,
              animationDuration: `${3 + particle.depth * 5}s`,
              animationDelay: `${Math.random() * 5}s`,
              transform: `scale(${1 + Math.sin(Date.now() / 1000 + index) * 0.2})`,
              transition: 'transform 0.3s ease-out, left 0.5s ease-out, top 0.5s ease-out',
            }}
          />
        );
      })}
      
      {/* Gradient overlays for depth */}
      <div className="absolute w-full h-full bg-gradient-to-b from-white/30 to-transparent"></div>
      
      {/* Connection lines */}
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(168, 85, 247, 0.1)" />
            <stop offset="50%" stopColor="rgba(168, 85, 247, 0.3)" />
            <stop offset="100%" stopColor="rgba(168, 85, 247, 0.1)" />
          </linearGradient>
        </defs>
        {[...Array(15)].map((_, i) => (
          <line
            key={i}
            x1="0%"
            y1={`${10 + i * 6}%`}
            x2="100%"
            y2={`${8 + i * 6 + Math.sin(i) * 10}%`}
            stroke="url(#lineGradient)"
            strokeWidth="1"
            className="animate-pulse"
            style={{ 
              animationDuration: `${4 + i * 0.5}s`,
              opacity: 0.7
            }}
          />
        ))}
      </svg>
    </div>
  );
};
