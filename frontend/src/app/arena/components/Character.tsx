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
  return (
    <div
      className="absolute z-30"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${characterSize.width}px`,
        height: `${characterSize.height}px`,
      }}
    >
      <div className="w-full h-full relative">
        <div 
          className={`w-full h-full rounded-full ${isOtherPlayer ? "bg-green-500" : "bg-blue-500"} flex items-center justify-center text-white font-bold`}
          style={{
            boxShadow: "0 0 10px rgba(0,0,0,0.3)"
          }}
        >
          {username.charAt(0).toUpperCase()}
        </div>
      </div>
      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
        <div className="bg-gray-800 bg-opacity-70 text-white px-2 py-0.5 text-xs rounded-full">
          {username}
        </div>
      </div>
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