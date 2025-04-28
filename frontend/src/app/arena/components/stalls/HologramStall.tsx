import React, { useState, useEffect } from "react";

interface HologramStallProps {
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
  };
  activeTile: number | null;
}

const HologramStall: React.FC<HologramStallProps> = ({ stall, activeTile }) => {
  const [rotation, setRotation] = useState(0);
  const isActive = activeTile === stall.id;
  const isStation = stall.type === "station";
  
  // Continuous rotation animation
  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => (prev + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute" style={{
      left: `${stall.x}px`,
      top: `${stall.y}px`,
      width: `${stall.width}px`,
      height: `${stall.height}px`,
      zIndex: 20,
    }}>
      {/* Projection platform */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4/5 h-1/6 rounded-lg overflow-hidden"
        style={{
          background: "linear-gradient(to bottom, #1e3a8a, #172554)",
          boxShadow: "0 0 20px rgba(30, 64, 175, 0.5)"
        }}>
        {/* Platform lights */}
        <div className="absolute top-0 left-0 w-full h-1 bg-blue-400 opacity-40"></div>
        <div className="absolute inset-x-0 top-1/2 transform -translate-y-1/2 flex justify-around">
          {Array.from({ length: 7 }).map((_, idx) => (
            <div key={`light-${idx}`} 
                className="w-1.5 h-1.5 bg-blue-300 rounded-full" 
                style={{ 
                  opacity: 0.6 + Math.sin(rotation / 20 + idx) * 0.4,
                  boxShadow: "0 0 5px rgba(59, 130, 246, 0.7)"
                }}>
            </div>
          ))}
        </div>
      </div>
      
      {/* Main hologram projection */}
      <div className="absolute bottom-1/6 left-1/2 transform -translate-x-1/2 w-full h-5/6 flex items-center justify-center">
        {/* Hologram container - cylindrical projection */}
        <div className={`relative w-4/5 h-4/5 rounded-full flex items-center justify-center ${
          isActive ? "ring-2 ring-blue-300 ring-opacity-30" : ""
        }`}
        style={{
          background: "radial-gradient(ellipse at center, rgba(37, 99, 235, 0.1) 0%, rgba(37, 99, 235, 0) 70%)",
          boxShadow: "0 0 30px rgba(37, 99, 235, 0.2)",
          overflow: "visible"
        }}>
          {/* Hologram rays - vertical beams */}
          <div className="absolute inset-0 w-full h-full overflow-hidden">
            {Array.from({ length: 24 }).map((_, idx) => (
              <div 
                key={`ray-${idx}`}
                className="absolute top-0 bottom-0 w-px bg-blue-400"
                style={{
                  left: `${(idx / 24) * 100}%`,
                  opacity: 0.1 + Math.sin(rotation / 30 + idx) * 0.05,
                  height: "200%",
                  top: "-50%"
                }}
              />
            ))}
          </div>
          
          {/* Hologram scan lines */}
          <div className="absolute inset-0 w-full h-full overflow-hidden opacity-20">
            {Array.from({ length: 20 }).map((_, idx) => (
              <div 
                key={`scan-${idx}`}
                className="absolute left-0 right-0 h-px bg-blue-200"
                style={{
                  top: `${(idx / 20) * 100}%`,
                  opacity: 0.3 + Math.sin(rotation / 15 + idx * 0.5) * 0.2
                }}
              />
            ))}
          </div>
          
          {/* Rotating rings */}
          <div className="absolute w-full h-full">
            <div className="absolute top-1/2 left-1/2 w-4/5 h-4/5 rounded-full border border-blue-400 opacity-20"
                style={{ 
                  transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
                  boxShadow: "0 0 10px rgba(59, 130, 246, 0.3)"
                }}></div>
            <div className="absolute top-1/2 left-1/2 w-2/3 h-2/3 rounded-full border border-blue-300 opacity-30"
                style={{ 
                  transform: `translate(-50%, -50%) rotate(${-rotation * 1.5}deg)`,
                  boxShadow: "0 0 10px rgba(59, 130, 246, 0.3)"
                }}></div>
            <div className="absolute top-1/2 left-1/2 w-1/2 h-1/2 rounded-full border border-blue-200 opacity-40"
                style={{ 
                  transform: `translate(-50%, -50%) rotate(${rotation * 0.7}deg)`,
                  boxShadow: "0 0 10px rgba(59, 130, 246, 0.3)"
                }}></div>
          </div>
          
          {/* Central hologram content */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Holographic icon */}
            <div className="text-4xl mb-2 text-blue-100" 
                style={{ 
                  textShadow: "0 0 10px rgba(59, 130, 246, 0.8)",
                  animation: "float 3s ease-in-out infinite",
                  transform: `perspective(500px) rotateY(${Math.sin(rotation / 100) * 20}deg)`
                }}>
              {stall.icon}
            </div>
            
            {/* Holographic data visualization */}
            <div className="w-16 h-5 flex justify-between">
              {Array.from({ length: 5 }).map((_, idx) => (
                <div 
                  key={`bar-${idx}`}
                  className="w-1.5 bg-blue-400 rounded-t-sm"
                  style={{
                    height: `${(Math.sin(rotation / 20 + idx * 1.5) * 0.5 + 0.5) * 100}%`,
                    opacity: 0.7,
                    boxShadow: "0 0 5px rgba(59, 130, 246, 0.5)"
                  }}
                />
              ))}
            </div>
          </div>
          
          {/* Floating data particles */}
          {Array.from({ length: 12 }).map((_, idx) => (
            <div
              key={`particle-${idx}`}
              className="absolute bg-blue-200 rounded-full"
              style={{
                width: idx % 3 === 0 ? "3px" : "2px",
                height: idx % 3 === 0 ? "3px" : "2px",
                left: `${Math.sin(rotation / 30 + idx) * 30 + 50}%`,
                top: `${Math.cos(rotation / 25 + idx) * 30 + 50}%`,
                opacity: Math.random() * 0.6 + 0.2,
                boxShadow: "0 0 3px rgba(59, 130, 246, 0.7)"
              }}
            />
          ))}
        </div>
      </div>
      
      {/* Digital name display */}
      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 px-3 py-1 rounded-lg backdrop-blur-sm">
        <div className="relative text-blue-300 text-xs font-mono">
          {/* Glitch effect for cyberpunk feel */}
          <span className="absolute top-0 left-0 w-full h-full text-red-300 opacity-30" 
                style={{ 
                  clipPath: "polygon(0 0, 100% 0, 100% 45%, 0 45%)",
                  transform: `translateX(${Math.sin(rotation / 50) * 2}px)`,
                  mixBlendMode: "screen"
                }}>
            {stall.name}
          </span>
          <span className="absolute top-0 left-0 w-full h-full text-blue-400 opacity-50" 
                style={{ 
                  clipPath: "polygon(0 55%, 100% 55%, 100% 100%, 0 100%)",
                  transform: `translateX(${-Math.sin(rotation / 40) * 2}px)`,
                  mixBlendMode: "screen"
                }}>
            {stall.name}
          </span>
          {stall.name}
        </div>
      </div>
      
      {/* Description when active */}
      {isActive && (
        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-80 p-2 rounded max-w-full border border-blue-500 border-opacity-30">
          <p className="text-blue-100 text-xs" style={{ textShadow: "0 0 5px rgba(59, 130, 246, 0.5)" }}>
            {stall.description}
          </p>
        </div>
      )}
      
      {/* Interaction prompt */}
      {isActive && (
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
          <div className="px-3 py-1 rounded-full text-xs text-blue-100 animate-pulse"
               style={{ 
                 background: "linear-gradient(to right, rgba(30, 58, 138, 0.7), rgba(37, 99, 235, 0.7))",
                 boxShadow: "0 0 10px rgba(37, 99, 235, 0.5)",
                 border: "1px solid rgba(59, 130, 246, 0.3)"
               }}>
            Press Space to interact
          </div>
        </div>
      )}
      
      {/* Keyframes and animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
};

export default HologramStall;