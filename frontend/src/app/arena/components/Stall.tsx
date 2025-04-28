import React from "react";

interface StallProps {
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
    type: string//"station" | "outpost";
  };
  activeTile: number | null;
}

const Stall: React.FC<StallProps> = ({ stall, activeTile }) => {
  const isActive = activeTile === stall.id;
  const isStation = stall.type === "station";

  return (
    <div
      className={`absolute border rounded-md shadow-lg overflow-hidden transition-all ${
        isActive ? "ring-2 ring-opacity-70" : ""
      } ${isStation 
        ? `${stall.bgColor} border-blue-500 ${isActive ? "ring-blue-400" : ""}` 
        : `${stall.bgColor} border-amber-700 ${isActive ? "ring-amber-400" : ""}`}`
      }
      style={{
        left: `${stall.x}px`,
        top: `${stall.y}px`,
        width: `${stall.width}px`,
        height: `${stall.height}px`,
        zIndex: 20,
        boxShadow: isStation 
          ? "0 0 15px rgba(59, 130, 246, 0.3)" 
          : "0 0 15px rgba(217, 119, 6, 0.3)",
      }}
    >
      {/* Header */}
      <div className={`relative h-10 flex items-center justify-center ${
        isStation ? "bg-blue-900" : "bg-amber-900"
      }`}>
        {/* Blinking lights for space stations */}
        {isStation && (
          <>
            <div className="absolute left-2 w-2 h-2 bg-blue-300 rounded-full animate-pulse"></div>
            <div className="absolute right-2 w-2 h-2 bg-red-400 rounded-full animate-pulse" 
              style={{animationDelay: "0.5s"}}></div>
          </>
        )}
        
        {/* Cave crystal decorations */}
        {!isStation && (
          <>
            <div className="absolute left-2 top-1 w-3 h-4 bg-amber-400 rotate-12 opacity-60"
              style={{clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)"}}></div>
            <div className="absolute right-3 top-2 w-2 h-3 bg-amber-300 -rotate-15 opacity-60"
              style={{clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)"}}></div>
          </>
        )}
        
        <span className="text-white text-sm font-medium z-10">
          {stall.name}
        </span>
      </div>
      
      {/* Main content */}
      <div className="flex flex-col items-center justify-center h-[calc(100%-40px)] p-2 relative">
        {/* Background patterns */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          {isStation ? (
            <div className="w-full h-full">
              <div className="absolute w-full h-px bg-blue-400/20 top-1/4"></div>
              <div className="absolute w-full h-px bg-blue-400/20 top-2/4"></div>
              <div className="absolute w-full h-px bg-blue-400/20 top-3/4"></div>
              <div className="absolute h-full w-px bg-blue-400/20 left-1/4"></div>
              <div className="absolute h-full w-px bg-blue-400/20 left-2/4"></div>
              <div className="absolute h-full w-px bg-blue-400/20 left-3/4"></div>
            </div>
          ) : (
            <div className="w-full h-full">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <pattern id="caves" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="10" cy="10" r="2" fill="rgba(245, 158, 11, 0.2)" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#caves)" />
              </svg>
            </div>
          )}
        </div>
        
        <div className="relative z-10 flex flex-col items-center justify-center h-full w-full">
          <div className={`text-3xl mb-2 ${isActive ? "animate-pulse" : ""}`}>
            {stall.icon}
          </div>
          {isActive && (
            <div className="text-xs text-center text-white/90 px-2 py-1 rounded-md bg-black/30 backdrop-blur-sm">
              {stall.description}
            </div>
          )}
        </div>
      </div>
      
      {isActive && (
        <div className="absolute bottom-2 left-0 w-full flex justify-center">
          <div className={`backdrop-blur-sm px-3 py-1 rounded-full text-xs animate-pulse shadow-lg text-white/90 border border-white/10 ${
            isStation ? "bg-blue-800/50" : "bg-amber-800/50"
          }`}>
            Press Space to interact
          </div>
        </div>
      )}
    </div>
  );
};

export default Stall;