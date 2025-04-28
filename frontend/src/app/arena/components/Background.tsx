import React from "react";

interface BackgroundProps {
  viewportSize: { width: number; height: number };
  tileSize: number;
  theme: "space" | "cave";
}

const Background: React.FC<BackgroundProps> = ({
  viewportSize,
  tileSize,
  theme
}) => {
  // Space theme has stars and a dark blue/purple gradient
  // Cave theme has a earthy gradient with subtle crystal patterns
  
  return (
    <div
      className="absolute inset-0 w-full h-full"
      style={{
        background: theme === "space" 
          ? "linear-gradient(to bottom, #0f172a, #1e1b4b)" 
          : "linear-gradient(to bottom, #422006, #292524)",
        backgroundRepeat: "repeat",
      }}
    >
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        {theme === "space" ? (
          // Space station grid pattern
          <div className="absolute inset-0 z-1" 
            style={{
              backgroundImage: `linear-gradient(to right, rgba(59, 130, 246, 0.1) 1px, transparent 1px), 
                                linear-gradient(to bottom, rgba(59, 130, 246, 0.1) 1px, transparent 1px)`,
              backgroundSize: `${tileSize * 2}px ${tileSize * 2}px`,
            }}
          />
        ) : (
          // Cave crystal pattern
          <div className="absolute inset-0 z-1 opacity-20" 
            style={{
              backgroundImage: `radial-gradient(circle, rgba(217, 119, 6, 0.2) 1px, transparent 4px)`,
              backgroundSize: `${tileSize * 2}px ${tileSize * 2}px`,
            }}
          />
        )}
      </div>

      {/* Stars for space theme */}
      {theme === "space" && (
        <>
          {Array.from({ length: 150 }).map((_, idx) => (
            <div
              key={`star-${idx}`}
              className="absolute bg-white rounded-full animate-pulse"
              style={{
                width: Math.random() < 0.3 ? "2px" : "1px",
                height: Math.random() < 0.3 ? "2px" : "1px",
                top: `${Math.random() * viewportSize.height}px`,
                left: `${Math.random() * viewportSize.width}px`,
                opacity: Math.random() * 0.7 + 0.3,
                animationDuration: `${Math.random() * 4 + 1.5}s`,
                zIndex: 3,
              }}
            />
          ))}
        </>
      )}

      {/* Crystals for cave theme */}
      {theme === "cave" && (
        <>
          {Array.from({ length: 20 }).map((_, idx) => (
            <div
              key={`crystal-${idx}`}
              className="absolute bg-amber-300 opacity-20"
              style={{
                width: Math.random() * 6 + 3,
                height: Math.random() * 10 + 5,
                top: `${Math.random() * viewportSize.height}px`,
                left: `${Math.random() * viewportSize.width}px`,
                clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
                transform: `rotate(${Math.random() * 40 - 20}deg)`,
                zIndex: 3,
              }}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default Background;