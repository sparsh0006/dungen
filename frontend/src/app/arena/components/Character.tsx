import React from "react";

interface CharacterProps {
  position: { x: number; y: number };
  username: string;
  currentEmote: string | null;
  characterSize: { width: number; height: number };
  isOtherPlayer?: boolean;
}

const Character: React.FC<CharacterProps> = ({
  position,
  username,
  currentEmote,
  characterSize,
  isOtherPlayer = false,
}) => {
  // Determine colors based on whether it's another player or not
  const mainColor = isOtherPlayer ? "bg-blue-600" : "bg-red-600";
  const accentColor = isOtherPlayer ? "bg-blue-400" : "bg-red-400";
  const engineColor = isOtherPlayer ? "bg-blue-800" : "bg-red-800";
  const windowColor = "bg-cyan-300";
  const metalColor = "bg-gray-400";

  return (
    <div
      className="absolute z-30"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${characterSize.width}px`,
        height: `${characterSize.height}px`,
        imageRendering: "pixelated",
      }}
    >
      <div className="w-full h-full relative">
        {/* Spaceship body - main hull */}
        <div className={`absolute top-1/4 left-1/6 w-2/3 h-1/2 ${mainColor} rounded-xl`}></div>
        
        {/* Cockpit window */}
        <div className={`absolute top-1/3 left-1/4 w-1/2 h-1/4 ${windowColor} rounded-lg`}></div>
        
        {/* Left wing */}
        <div className={`absolute top-1/3 left-0 w-1/6 h-1/3 ${accentColor} transform skew-x-12`}></div>
        
        {/* Right wing */}
        <div className={`absolute top-1/3 right-0 w-1/6 h-1/3 ${accentColor} transform -skew-x-12`}></div>
        
        {/* Nose cone */}
        <div className={`absolute top-1/6 left-1/3 w-1/3 h-1/6 ${metalColor} rounded-t-full`}></div>
        
        {/* Engine exhaust left */}
        <div className={`absolute bottom-1/6 left-1/4 w-1/5 h-1/6 ${engineColor} rounded-b-lg`}></div>
        
        {/* Engine exhaust right */}
        <div className={`absolute bottom-1/6 right-1/4 w-1/5 h-1/6 ${engineColor} rounded-b-lg`}></div>
        
        {/* Thruster flame left - animated */}
        <div className="absolute bottom-0 left-1/4 w-1/5 h-1/6 bg-yellow-400 rounded-b-full animate-pulse"></div>
        
        {/* Thruster flame right - animated */}
        <div className="absolute bottom-0 right-1/4 w-1/5 h-1/6 bg-yellow-400 rounded-b-full animate-pulse"></div>
        
        {/* Small details - antenna */}
        <div className={`absolute top-0 left-1/2 w-[2%] h-1/6 ${metalColor}`}></div>
        <div className={`absolute top-0 left-1/2 w-[6%] h-[3%] ${metalColor} rounded-full`}></div>
      </div>
      
      {/* Username display */}
      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
        <div className="bg-gray-900 bg-opacity-70 text-white px-2 py-0.5 text-xs rounded-full font-pixel">
          {username}
        </div>
      </div>
      
      {/* Emote display */}
      {currentEmote && (
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="bg-white rounded-full w-8 h-8 flex items-center justify-center text-lg shadow-lg">
            {currentEmote}
          </div>
        </div>
      )}
    </div>
  );
};

export default Character;