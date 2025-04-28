import React, { useState, useEffect } from "react";

interface PlantStallProps {
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
    price?: string;
    currency?: string;
  };
  activeTile: number | null;
}

const PlantStall: React.FC<PlantStallProps> = ({ stall, activeTile }) => {
  const [growthStage, setGrowthStage] = useState(0);
  const [leaves, setLeaves] = useState<Array<{id: number, x: number, y: number, rotate: number, scale: number}>>([]);
  const isActive = activeTile === stall.id;
  
  // Generate random leaves positions
  useEffect(() => {
    const newLeaves = Array.from({ length: 8 }).map((_, idx) => ({
      id: idx,
      x: Math.random() * 100,
      y: Math.random() * 60 + 20,
      rotate: Math.random() * 360,
      scale: 0.5 + Math.random() * 0.5
    }));
    setLeaves(newLeaves);
  }, []);

  // Growth animation
  useEffect(() => {
    const interval = setInterval(() => {
      setGrowthStage(prev => {
        const next = prev + 0.01;
        return next > 1 ? 0 : next;
      });
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Calculate green shades based on the stall's properties
  const mainGreen = stall.bgColor || "#2F855A";
  const lightGreen = "#68D391";
  const darkGreen = "#22543D";

  return (
    <div className="absolute" style={{
      left: `${stall.x}px`,
      top: `${stall.y}px`,
      width: `${stall.width}px`,
      height: `${stall.height}px`,
      zIndex: 20,
    }}>
      {/* Plant pot */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/5 h-1/4 rounded-b-xl rounded-t-sm overflow-hidden"
        style={{
          background: "linear-gradient(to bottom, #CD7F32, #8B4513)",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)"
        }}>
        {/* Soil texture */}
        <div className="absolute bottom-0 w-full h-1/2 bg-amber-800 opacity-70">
          {Array.from({ length: 10 }).map((_, idx) => (
            <div key={`soil-${idx}`} 
                className="absolute rounded-full bg-amber-900"
                style={{
                  width: `${2 + Math.random() * 3}px`,
                  height: `${2 + Math.random() * 3}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  opacity: 0.8
                }}
            />
          ))}
        </div>
        
        {/* Pot rim detail */}
        <div className="absolute top-0 left-0 w-full h-1/5 bg-gradient-to-r from-amber-600 via-amber-700 to-amber-600"></div>
        
        {/* Price tag */}
        <div className="absolute -right-2 -top-3 bg-white px-2 py-1 rounded-lg shadow-md transform rotate-12">
          <div className="text-xs font-bold text-green-700">
            {stall.price || "5.00"} {stall.currency || "ETH"}
          </div>
        </div>
      </div>
      
      {/* Main plant stem */}
      <div className="absolute bottom-1/4 left-1/2 transform -translate-x-1/2 w-1 bg-green-700"
           style={{ 
             height: `${30 + growthStage * 40}%`,
             transition: "height 0.5s ease-out"
           }}>
        {/* Growth animation particles */}
        {isActive && Array.from({ length: 3 }).map((_, idx) => (
          <div key={`particle-${idx}`}
               className="absolute left-1/2 w-2 h-2 rounded-full bg-green-300 opacity-80"
               style={{
                 transform: "translate(-50%, 0)",
                 bottom: `${(idx * 30) + ((growthStage * 100) % 30)}%`,
                 animation: `float 3s ease-in-out infinite ${idx * 0.5}s`,
                 opacity: 0.7 - (idx * 0.2)
               }}
          />
        ))}
      </div>
      
      {/* Plant leaves */}
      <div className="absolute bottom-1/4 left-1/2 w-full h-3/4 transform -translate-x-1/2">
        {leaves.map(leaf => (
          <div 
            key={`leaf-${leaf.id}`}
            className="absolute"
            style={{
              left: `${leaf.x}%`,
              bottom: `${leaf.y}%`,
              transform: `rotate(${leaf.rotate}deg) scale(${leaf.scale * (0.5 + growthStage / 2)})`,
              transition: "transform 0.5s ease-out"
            }}
          >
            <svg width="20" height="10" viewBox="0 0 20 10" fill="none">
              <path 
                d="M1,5 Q5,0 10,5 Q15,10 19,5" 
                stroke={mainGreen} 
                strokeWidth="0.5" 
                fill={lightGreen} 
                style={{ filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.2))" }}
              />
            </svg>
          </div>
        ))}
        
        {/* Main plant flower/feature */}
        <div className="absolute left-1/2 transform -translate-x-1/2"
             style={{ bottom: `${40 + growthStage * 40}%` }}>
          <div className="relative">
            {/* Flower petals */}
            {Array.from({ length: 8 }).map((_, idx) => (
              <div 
                key={`petal-${idx}`}
                className="absolute w-4 h-4 rounded-full bg-green-300"
                style={{ 
                  transform: `rotate(${idx * 45}deg) translateY(-10px) scale(${0.7 + growthStage * 0.5})`,
                  background: idx % 2 === 0 ? lightGreen : mainGreen,
                  opacity: 0.9,
                  transformOrigin: "center bottom",
                  animation: `breathe 4s ease-in-out infinite ${idx * 0.2}s`
                }}
              />
            ))}
            
            {/* Flower center */}
            <div className="w-4 h-4 rounded-full" style={{ 
              background: darkGreen,
              boxShadow: isActive ? "0 0 10px rgba(104, 211, 145, 0.5)" : "none"
            }}></div>
          </div>
        </div>
      </div>
      
      {/* Plant name display */}
      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-green-900 bg-opacity-80 px-3 py-1 rounded-lg">
        <div className="text-green-100 text-xs font-serif tracking-wide">
          {stall.name}
        </div>
      </div>
      
      {/* Description when active */}
      {isActive && (
        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-green-50 p-2 rounded max-w-full border border-green-300">
          <p className="text-green-800 text-xs">
            {stall.description}
          </p>
        </div>
      )}
      
      {/* Interaction prompt */}
      {isActive && (
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
          <div className="px-3 py-1 rounded-full text-xs text-white animate-bounce"
               style={{ background: "linear-gradient(to right, #2F855A, #48BB78)" }}>
            Press Space to view price
          </div>
        </div>
      )}
      
      <style jsx>{`
        @keyframes breathe {
          0%, 100% { transform: rotate(var(--rotation)) translateY(-10px) scale(var(--scale)); }
          50% { transform: rotate(var(--rotation)) translateY(-10px) scale(calc(var(--scale) * 1.1)); }
        }
        
        @keyframes float {
          0% { transform: translate(-50%, 0) scale(1); opacity: 0.7; }
          100% { transform: translate(-50%, -20px) scale(0); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default PlantStall;