import React from "react";

interface HeaderUIProps {
  formattedAddress: string;
  returnToHome: () => void;
  roomCode: string | null;
  handleLeaveRoom: () => void;
  theme: "space" | "cave";
}

const HeaderUI: React.FC<HeaderUIProps> = ({
  formattedAddress,
  returnToHome,
  roomCode,
  handleLeaveRoom,
  theme
}) => {
  return (
    <>
      <div className="absolute top-0 left-0 w-full bg-gray-800 bg-opacity-90 px-4 py-4 flex justify-between items-center z-50">
        <button
          onClick={returnToHome}
          className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded-md flex items-center text-sm"
        >
          ← Home
        </button>
        <div className="flex flex-col items-center">
            <h1 className="text-2xl font-bold text-white">
              {theme === "space" ? "DunGen : A Space Odyssey" : "Crystal Caverns"}
            </h1>
        </div>
        <div className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm flex items-center">
          <div className="w-2 h-2 bg-blue-300 rounded-full mr-2 animate-pulse"></div>
          {formattedAddress ? (
            <span>{formattedAddress}</span>
          ) : (
            "Wallet Connected"
          )}
        </div>
      </div>

      {roomCode && (
        <div className="absolute top-16 left-4 z-40 flex items-center">
          <div className="flex items-center bg-gray-700 bg-opacity-90 px-3 py-2 rounded-md border border-gray-600">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
            <span className="text-white text-sm mr-2">Room:</span>
            <span className="font-mono font-bold text-blue-300">
              {roomCode}
            </span>
          </div>
          <button
            onClick={handleLeaveRoom}
            className="ml-2 px-3 py-2 bg-red-700 hover:bg-red-600 text-white text-sm rounded-md flex items-center"
          >
            <span className="mr-1.5">🚪</span> Leave Room
          </button>
        </div>
      )}
    </>
  );
};

export default HeaderUI;