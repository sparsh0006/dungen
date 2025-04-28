import React from "react";

interface ControlsUIProps {
  showControls: boolean;
  toggleControlsVisibility: () => void;
  setShowNameInput: (show: boolean) => void;
  theme: "space" | "cave"; // Add this line
  toggleTheme: () => void; // Add this line
}

const ControlsUI: React.FC<ControlsUIProps> = ({
  showControls,
  toggleControlsVisibility,
  setShowNameInput,
  theme, // Add this line
  toggleTheme, // Add this line
}) => {
  if (!showControls) {
    return (
      <button
        className="fixed bottom-4 right-4 px-3 py-2 bg-gray-700 text-white rounded-md text-sm z-50"
        onClick={toggleControlsVisibility}
      >
        Show UI
      </button>
    );
  }

  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 bg-gray-800 bg-opacity-90 rounded-t-lg border border-gray-700 border-b-0 p-2 flex items-center space-x-3 text-white z-50">
      <div className="flex space-x-1">
        <div className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center border border-gray-600">
          ⬆️
        </div>
      </div>
      <div className="flex space-x-1">
        <div className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center border border-gray-600">
          ⬅️
        </div>
        <div className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center border border-gray-600">
          ⬇️
        </div>
        <div className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center border border-gray-600">
          ➡️
        </div>
      </div>
      <div className="h-6 border-l border-gray-600"></div>
      <div className="flex items-center space-x-1">
        <div className="text-xs text-gray-400">Space:</div>
        <div className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center border border-gray-600 text-xs">
          Talk
        </div>
      </div>
      <button
        className="px-2 py-1 bg-blue-600 hover:bg-blue-500 rounded text-xs"
        onClick={() => setShowNameInput(true)}
      >
        Change Name
      </button>
      <button
        className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs"
        onClick={toggleControlsVisibility}
      >
        Hide UI
      </button>

      <button
        className="px-2 py-1 bg-blue-600 hover:bg-blue-500 rounded text-xs"
        onClick={() => setShowNameInput(true)}
      >
        Change Name
      </button>
      <button
        className="px-2 py-1 bg-purple-600 hover:bg-purple-500 rounded text-xs ml-2"
        onClick={toggleTheme}
      >
        Switch to {theme === "space" ? "Cave" : "Space"}
      </button>
      <button
        className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs ml-2"
        onClick={toggleControlsVisibility}
      >
        Hide UI
      </button>

    </div>
  );
};

export default ControlsUI;