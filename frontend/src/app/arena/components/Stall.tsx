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
  };
  activeTile: number | null;
}

const Stall: React.FC<StallProps> = ({ stall, activeTile }) => {
  return (
    <div
      className={`absolute ${stall.bgColor} border border-gray-600 rounded-md shadow-lg overflow-hidden ${
        activeTile === stall.id ? "ring-2 ring-blue-400 ring-opacity-70" : ""
      }`}
      style={{
        left: `${stall.x}px`,
        top: `${stall.y}px`,
        width: `${stall.width}px`,
        height: `${stall.height}px`,
        zIndex: 20,
        transition: "all 0.2s ease",
      }}
    >
      <div className="relative h-10 bg-gray-700 flex items-center justify-center">
        <span className="text-white text-sm font-medium">
          {stall.name}
        </span>
      </div>
      <div className="flex flex-col items-center justify-center h-[calc(100%-40px)] p-2">
        <div className="text-4xl mb-2">
          {stall.icon}
        </div>
        <div className="text-xs text-gray-200 text-center">
          {stall.description}
        </div>
      </div>
      {activeTile === stall.id && (
        <div className="absolute bottom-2 left-0 w-full flex justify-center">
          <div className="backdrop-blur-sm bg-blue-800/50 text-white px-3 py-1 rounded-full text-xs animate-pulse shadow-lg">
            Press Space to interact
          </div>
        </div>
      )}
    </div>
  );
};

export default Stall;