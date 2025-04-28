import React from "react";

interface ArtifactStallProps {
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
    isExpansion?: boolean;
  };
  activeTile: number | null;
}

const ArtifactStall: React.FC<ArtifactStallProps> = ({ stall, activeTile }) => {
  return (
    <div
      className="absolute"
      style={{
        left: `${stall.x}px`,
        top: `${stall.y}px`,
        width: `${stall.width}px`,
        height: `${stall.height}px`,
        zIndex: 20,
      }}
    >
      {/* Stone pedestal */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/5 h-1/5 bg-gray-700 rounded-md">
        {/* Pedestal details */}
        <div className="absolute bottom-full left-0 w-full h-3 bg-gray-600"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gray-800 opacity-50"></div>
        
        {/* Ancient carvings */}
        <div className="absolute top-1/2 left-0 w-full flex justify-around items-center transform -translate-y-1/2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div 
              key={`carving-${i}`} 
              className="w-3 h-1 bg-gray-500 opacity-70"
            ></div>
          ))}
        </div>
      </div>
      
      {/* Main artifact */}
      <div className="absolute bottom-1/5 left-1/2 transform -translate-x-1/2 w-full h-4/5 flex items-center justify-center">
        {/* Stone tablet background */}
        <div 
          className={`w-4/5 h-4/5 bg-stone-600 rounded-sm flex flex-col items-center justify-center relative ${
            activeTile === stall.id ? "ring-2 ring-amber-300 ring-opacity-50" : ""
          }`}
          style={{
            backgroundImage: "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"100\" height=\"100\" viewBox=\"0 0 100 100\"><rect width=\"100\" height=\"100\" fill=\"%23555555\" /><path d=\"M0,0 L100,100 M100,0 L0,100\" stroke=\"%23444444\" stroke-width=\"0.5\"/></svg>')",
            boxShadow: "inset 0 0 10px rgba(0, 0, 0, 0.5), 0 5px 15px rgba(0, 0, 0, 0.4)",
          }}
        >
          {/* Cracks */}
          <div 
            className="absolute top-1/4 left-1/3 w-1/2 h-1/2"
            style={{
              background: "linear-gradient(45deg, transparent 49.5%, rgba(0,0,0,0.1) 49.5%, rgba(0,0,0,0.1) 50.5%, transparent 50.5%)",
            }}
          ></div>
          <div 
            className="absolute top-2/3 right-1/4 w-1/3 h-1/4"
            style={{
              background: "linear-gradient(135deg, transparent 49.5%, rgba(0,0,0,0.1) 49.5%, rgba(0,0,0,0.1) 50.5%, transparent 50.5%)",
            }}
          ></div>
          
          {/* Glowing inscriptions */}
          <div className="w-3/4 h-1/5 flex justify-around items-center mb-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div 
                key={`glyph-top-${i}`} 
                className="w-4 h-4 bg-amber-500 rounded-sm opacity-60"
                style={{
                  boxShadow: "0 0 5px rgba(245, 158, 11, 0.5)",
                  animation: `pulse ${2 + i * 0.5}s infinite`,
                }}
              ></div>
            ))}
          </div>
          
          {/* Main symbol */}
          <div 
            className="text-5xl mb-2"
            style={{
              filter: "drop-shadow(0 0 5px rgba(245, 158, 11, 0.5))",
            }}
          >
            {stall.icon}
          </div>
          
          {/* Bottom inscriptions */}
          <div className="w-3/4 h-1/5 flex justify-around items-center mt-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div 
                key={`glyph-bottom-${i}`} 
                className="w-2 h-2 bg-amber-500 rounded-full opacity-60"
                style={{
                  boxShadow: "0 0 5px rgba(245, 158, 11, 0.5)",
                  animation: `pulse ${2 + i * 0.3}s infinite`,
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Floating name scroll */}
      <div 
        className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-amber-100 px-4 py-2 rounded-sm z-30"
        style={{
          boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
          background: "linear-gradient(to right, rgba(254, 243, 199, 0.9), rgba(252, 211, 77, 0.9), rgba(254, 243, 199, 0.9))",
        }}
      >
        <p className="text-amber-900 text-sm font-serif">{stall.name}</p>
        {/* Scroll edge details */}
        <div className="absolute -left-2 top-0 bottom-0 w-2 bg-amber-100 rounded-l-md"></div>
        <div className="absolute -right-2 top-0 bottom-0 w-2 bg-amber-100 rounded-r-md"></div>
      </div>
      
      {/* Mystical particles */}
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={`particle-${i}`}
          className="absolute w-1 h-1 bg-amber-300 rounded-full"
          style={{
            left: `${20 + Math.random() * 60}%`,
            top: `${30 + Math.random() * 40}%`,
            opacity: Math.random() * 0.6 + 0.2,
            animation: `float ${2 + Math.random() * 3}s infinite`,
            boxShadow: "0 0 3px rgba(245, 158, 11, 0.7)",
          }}
        />
      ))}
      
      {/* Description when active */}
      {activeTile === stall.id && (
        <>
          <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-amber-800 bg-opacity-90 p-2 rounded border border-amber-600 max-w-full z-30">
            <p className="text-amber-100 text-xs">{stall.description}</p>
          </div>
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-amber-700 bg-opacity-80 px-3 py-1 rounded-full animate-pulse z-30 border border-amber-600">
            <p className="text-amber-100 text-xs">Press Space to interact</p>
          </div>
        </>
      )}
    </div>
  );
};

export default ArtifactStall;