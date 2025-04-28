import React, { useState, useEffect } from "react";

interface PortalStallProps {
  stall: {
    id: number;
    name: string;
    x: number;
    y: number;
    width: number;
    height: number;
    bgColor: string;
    icon: string;
    description: string;
    type: string;
    fromChain?: string;
    toChain?: string;
  };
  activeTile: number | null;
}

const PortalStall: React.FC<PortalStallProps> = ({ stall, activeTile }) => {
  const [portalEnergy, setPortalEnergy] = useState(0);
  const [particlesCount, setParticlesCount] = useState(30);
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, size: number, speed: number, hue: number}>>([]);
  const isActive = activeTile === stall.id;
  
  // Generate portal particles
  useEffect(() => {
    const newParticles = Array.from({ length: particlesCount }).map((_, idx) => ({
      id: idx,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 3,
      speed: 0.5 + Math.random() * 2,
      hue: Math.random() * 60 + 260 // Purple to blue range
    }));
    setParticles(newParticles);
  }, [particlesCount]);

  // Portal animation
  useEffect(() => {
    const interval = setInterval(() => {
      setPortalEnergy(prev => (prev + 0.02) % 1);
      setParticles(prev => prev.map(particle => ({
        ...particle,
        x: (particle.x + particle.speed / 10) % 100,
        y: (particle.y + particle.speed / 15) % 100
      })));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Increase particle count when active
  useEffect(() => {
    if (isActive) {
      setParticlesCount(60);
    } else {
      setParticlesCount(30);
    }
  }, [isActive]);

  // Calculate portal colors based on stall properties
  const portalColor = stall.bgColor || "#7928CA";
  const portalSecondaryColor = "#FF0080";

  return (
    <div className="absolute" style={{
      left: `${stall.x}px`,
      top: `${stall.y}px`,
      width: `${stall.width}px`,
      height: `${stall.height}px`,
      zIndex: 20,
    }}>
      {/* Portal base/stand */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/4 h-1/6 rounded-md overflow-hidden"
        style={{
          background: "linear-gradient(to top, #1E293B, #334155)",
          boxShadow: "0 4px 15px rgba(0, 0, 0, 0.5)"
        }}>
        {/* Base light strip */}
        <div className="absolute bottom-0 left-0 w-full h-1/4 bg-purple-500 opacity-40"></div>
        
        {/* Technology patterns */}
        <div className="absolute inset-0">
          {Array.from({ length: 5 }).map((_, idx) => (
            <div key={`tech-line-${idx}`}
                 className="absolute h-px bg-purple-300"
                 style={{ 
                   top: `${20 + idx * 20}%`, 
                   left: `${10 + (idx % 2) * 20}%`,
                   width: `${30 + (idx % 3) * 20}%`,
                   opacity: 0.4 + (Math.sin(portalEnergy * Math.PI * 2 + idx) + 1) / 4
                 }}
            />
          ))}
          
          {/* Control lights */}
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={`control-${idx}`}
                 className="absolute w-2 h-2 rounded-full"
                 style={{ 
                   top: '30%', 
                   left: `${25 + idx * 25}%`,
                   backgroundColor: idx === 1 && isActive ? "#FF0080" : "#A855F7",
                   boxShadow: `0 0 5px ${idx === 1 && isActive ? "#FF0080" : "#A855F7"}`,
                   opacity: 0.5 + (Math.sin(portalEnergy * Math.PI * 4 + idx * 2) + 1) / 4
                 }}
            />
          ))}
        </div>
      </div>
      
      {/* Chain connection indicators */}
      <div className="absolute bottom-1/6 left-0 w-full flex justify-between px-4">
        <div className="flex flex-col items-center">
          <div className="w-3 h-3 rounded-full bg-blue-400"
               style={{ boxShadow: "0 0 8px #60A5FA" }}></div>
          <div className="text-blue-200 text-xs mt-1 font-mono">
            {stall.fromChain || "RUSDT"}
          </div>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="w-3 h-3 rounded-full bg-green-400"
               style={{ boxShadow: "0 0 8px #4ADE80" }}></div>
          <div className="text-green-200 text-xs mt-1 font-mono">
            {stall.toChain || "RBTC"}
          </div>
        </div>
      </div>
      
      {/* Main portal */}
      <div className="absolute bottom-1/6 left-1/2 transform -translate-x-1/2 -translate-y-1/4 w-3/4 aspect-square rounded-full flex items-center justify-center"
           style={{
             background: `radial-gradient(circle, ${portalColor}99 0%, ${portalColor}00 70%)`,
             boxShadow: `0 0 40px ${portalColor}40`,
             transform: `translate(-50%, -30%) scale(${0.8 + portalEnergy * 0.1})`,
             transition: "transform 0.3s ease-out"
           }}>
        
        {/* Portal ring */}
        <div className="absolute w-full h-full rounded-full border-8 border-opacity-60"
             style={{ 
               borderColor: portalColor,
               boxShadow: `inset 0 0 20px ${portalColor}, 0 0 20px ${portalColor}`,
               animation: "spin 10s linear infinite"
             }}>
          {/* Portal runes/markings */}
          {Array.from({ length: 12 }).map((_, idx) => (
            <div key={`rune-${idx}`}
                 className="absolute w-3 h-6 bg-purple-300"
                 style={{ 
                   top: "50%",
                   left: "50%",
                   marginLeft: "-1.5px",
                   marginTop: "-3px",
                   transformOrigin: "center 150px",
                   transform: `rotate(${idx * 30}deg) translateY(-150px) scale(${0.7 + Math.sin(portalEnergy * Math.PI * 2 + idx) * 0.3})`,
                   opacity: 0.6 + Math.sin(portalEnergy * Math.PI * 2 + idx * 0.5) * 0.4,
                   clipPath: "polygon(0% 0%, 100% 0%, 100% 70%, 50% 100%, 0% 70%)"
                 }}
            />
          ))}
        </div>
        
        {/* Inner portal ring */}
        <div className="absolute w-4/5 h-4/5 rounded-full border-4 border-opacity-40"
             style={{ 
               borderColor: portalSecondaryColor,
               boxShadow: `inset 0 0 15px ${portalSecondaryColor}, 0 0 15px ${portalSecondaryColor}`,
               animation: "spin 7s linear infinite reverse"
             }}></div>
        
        {/* Portal center */}
        <div className="absolute w-3/5 h-3/5 rounded-full"
             style={{ 
               background: `radial-gradient(circle, ${portalSecondaryColor}cc, ${portalColor}99)`,
               boxShadow: `0 0 30px ${portalSecondaryColor}66`,
               animation: "pulse 4s ease-in-out infinite"
             }}>
          
          {/* Portal vortex pattern */}
          <div className="absolute inset-0 rounded-full overflow-hidden">
            <div className="absolute w-200% h-200% top-50% left-50% transform -translate-x-1/2 -translate-y-1/2"
                 style={{ 
                   background: `conic-gradient(${portalSecondaryColor}00, ${portalSecondaryColor}66, ${portalSecondaryColor}00)`,
                   transform: `translate(-50%, -50%) rotate(${portalEnergy * 360}deg)`,
                 }}></div>
          </div>
          
          {/* Portal icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-white text-3xl transform"
                 style={{ 
                   textShadow: `0 0 10px ${portalSecondaryColor}`,
                   transform: `scale(${1 + Math.sin(portalEnergy * Math.PI * 2) * 0.2})` 
                 }}>
              {stall.icon}
            </div>
          </div>
        </div>
        
        {/* Portal particles */}
        {particles.map(particle => (
          <div 
            key={`particle-${particle.id}`}
            className="absolute rounded-full"
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              background: `hsla(${particle.hue}, 100%, 70%, 0.8)`,
              boxShadow: `0 0 ${particle.size * 2}px hsla(${particle.hue}, 100%, 70%, 0.8)`,
              zIndex: particle.y > 50 ? 1 : -1
            }}
          />
        ))}
        
        {/* Token transfer animation */}
        {isActive && (
          <div className="absolute left-0 w-full">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div key={`token-${idx}`}
                   className="absolute w-3 h-3 rounded-full bg-white"
                   style={{ 
                     left: `${10 + ((portalEnergy * 100 + idx * 20) % 80)}%`,
                     top: "50%",
                     transform: "translateY(-50%)",
                     opacity: 0.8,
                     filter: "blur(1px)",
                     boxShadow: "0 0 10px white"
                   }}/>
            ))}
          </div>
        )}
      </div>
      
      {/* Stall name display */}
      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-purple-900 bg-opacity-70 px-3 py-1 rounded-lg backdrop-blur-sm">
        <div className="text-purple-100 text-xs font-mono tracking-wider">
          <span className="text-pink-400">&lt;</span> {stall.name} <span className="text-pink-400">&gt;</span>
        </div>
      </div>
      
      {/* Description when active */}
      {isActive && (
        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-slate-800 p-2 rounded max-w-full border border-purple-500">
          <p className="text-purple-100 text-xs">
            {stall.description}
          </p>
        </div>
      )}
      
      {/* Interaction prompt */}
      {isActive && (
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
          <div className="px-3 py-1 rounded-full text-xs text-white"
               style={{ 
                 background: `linear-gradient(to right, ${portalColor}, ${portalSecondaryColor})`,
                 animation: "pulse 2s infinite" 
               }}>
            Press Space to transfer tokens
          </div>
        </div>
      )}
      
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.8; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
};

export default PortalStall;