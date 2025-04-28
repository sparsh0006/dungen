import React from "react";

interface TeamButtonsProps {
  roomCode: string | null;
  isConnected: boolean;
  socketError: string | null;
  handleCreateTeam: () => void;
  handleJoinTeam: () => void;
}

const TeamButtons: React.FC<TeamButtonsProps> = ({
  roomCode,
  isConnected,
  socketError,
  handleCreateTeam,
  handleJoinTeam,
}) => {
  if (roomCode) return null;

  return (
    <div className="absolute top-20 left-0 w-full flex flex-col items-center z-40">
      {!isConnected && (
        <div className="bg-red-700 bg-opacity-90 px-4 py-2 rounded-md mb-4 flex items-center">
          <div className="w-2 h-2 bg-red-400 rounded-full mr-2 animate-pulse"></div>
          <span className="text-white text-sm">
            Socket connection unavailable. Please check the server.
          </span>
        </div>
      )}

      {socketError && (
        <div className="bg-red-700 bg-opacity-90 px-4 py-2 rounded-md mb-4">
          <span className="text-white text-sm">{socketError}</span>
        </div>
      )}

      <div className="flex justify-center items-center space-x-12">
        <button
          onClick={handleCreateTeam}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md"
          disabled={!isConnected}
          style={{
            opacity: isConnected ? 1 : 0.5,
            cursor: isConnected ? "pointer" : "not-allowed",
          }}
        >
          Create Room
        </button>

        <button
          onClick={handleJoinTeam}
          className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-md"
          disabled={!isConnected}
          style={{
            opacity: isConnected ? 1 : 0.5,
            cursor: isConnected ? "pointer" : "not-allowed",
          }}
        >
          Join Room
        </button>
      </div>

      {isConnected && (
        <div className="mt-2 text-green-400 text-xs">
          <span>✓ Connected to server</span>
        </div>
      )}
    </div>
  );
};

export default TeamButtons;