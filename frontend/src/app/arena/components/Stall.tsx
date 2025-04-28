import React from "react";
import HologramStall from './stalls/HologramStall';
import PlantStall from './stalls/PlantStall';
import PortalStall from './stalls/PortalStall';
import ArtifactStall from './stalls/ArtifactStall';
import CompanionStall from './stalls/CompanionStall';
import DefaultStall from './stalls/DefaultStall';

interface StallProps {
  stall: {
    id: number;
    name: string;
    x: number;
    y: number;
    width: number;
    height: number;
    bgColor: string;
    borderColor?: string;
    roofColor?: string;
    roofAltColor?: string;
    accentColor?: string;
    darkColor?: string;
    counterColor?: string;
    area?: string;
    icon: string;
    description: string;
    decorations?: string[];
    isExpansion?: boolean;
    type: string; // "station" | "outpost"
    variant?: string; // "hologram" | "plant" | "portal" | "artifact" | "companion" | "default"
  };
  activeTile: number | null;
}

const StallVariants = {
  hologram: (props: any) => <HologramStall {...props} />,
  plant: (props: any) => <PlantStall {...props} />,
  portal: (props: any) => <PortalStall {...props} />,
  artifact: (props: any) => <ArtifactStall {...props} />,
  companion: (props: any) => <CompanionStall {...props} />,
  default: (props: any) => <DefaultStall {...props} />  // Keep original stall as an option
};

const Stall: React.FC<StallProps> = ({ stall, activeTile }) => {
  const isActive = activeTile === stall.id;
  const isStation = stall.type === "station";

  // Use the appropriate stall variant if specified, otherwise render the new default
  if (stall.variant && StallVariants[stall.variant as keyof typeof StallVariants]) {
    // Pass the original stall props to the variant component
    return StallVariants[stall.variant as keyof typeof StallVariants]({ stall, activeTile });
  }

  // Default new design - Space/Cave themed stall
  return (
    <div
      className={`absolute ${stall.bgColor} bg-opacity-30 backdrop-blur-sm border border-opacity-10 rounded-lg overflow-hidden ${
        activeTile === stall.id ? "ring-2 ring-white ring-opacity-50 shadow-glow" : ""
      }`}
      style={{
        left: `${stall.x}px`,
        top: `${stall.y}px`,
        width: `${stall.width}px`,
        height: `${stall.height}px`,
        zIndex: 20,
        animation: "pulse 3s infinite",
        boxShadow: "0 0 15px rgba(255, 255, 255, 0.2)",
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
        
        {/* Floating particles */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={`particle-${i}`}
            className={`absolute w-1 h-1 rounded-full ${isStation ? 'bg-blue-200' : 'bg-amber-200'}`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.2,
              animation: `float ${2 + Math.random() * 3}s infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
        
        <div className="relative z-10 flex flex-col items-center justify-center h-full w-full">
          <div className={`text-3xl mb-2 ${isActive ? "animate-pulse" : ""}`}
               style={{
                 filter: isStation ? 
                   "drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))" : 
                   "drop-shadow(0 0 8px rgba(245, 158, 11, 0.5))"
               }}>
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

      {/* Add animation keyframes */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        .shadow-glow {
          box-shadow: 0 0 20px rgba(255, 255, 255, 0.4);
        }
      `}</style>
    </div>
  );
};

export default Stall;