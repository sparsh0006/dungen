import React from "react";

interface BackgroundProps {
  viewportSize: { width: number; height: number };
  tileSize: number;
}

const Background: React.FC<BackgroundProps> = ({
  viewportSize,
  tileSize,
}) => {
  return (
    <div
      className="absolute inset-0 w-full h-full"
      style={{
        background: "linear-gradient(to bottom, #1a202c, #2d3748)",
        backgroundRepeat: "repeat",
      }}
    >
      <div
        className="absolute inset-0 z-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAFElEQVRYhe3BAQEAAACAkP6v7ggKAAAuZTBhFAAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMC0wMS0wOFQxOTozNzoxMCswMDowMDRxa5QAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjAtMDEtMDhUMTk6Mzc6MTArMDA6MDClLNMoAAAAAElFTkSuQmCC')",
          backgroundSize: `${tileSize}px ${tileSize}px`,
        }}
      />

      {/* Grid Pattern */}
      <div className="absolute inset-0 z-1" 
        style={{
          backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), 
                            linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)`,
          backgroundSize: `${tileSize * 2}px ${tileSize * 2}px`,
        }}
      />
    </div>
  );
};

export default Background;