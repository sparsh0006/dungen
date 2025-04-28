import React, { useState, useEffect } from "react";

interface CompanionStallProps {
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
    type: string;
    stakingAPY?: string;
    lockPeriod?: string;
    companionType?: string;
  };
  activeTile: number | null;
}

const CompanionStall: React.FC<CompanionStallProps> = ({ stall, activeTile }) => {
  const [animationFrame, setAnimationFrame] = useState(0);
  const [eyeDirection, setEyeDirection] = useState({ x: 0, y: 0 });
  const [isHappy, setIsHappy] = useState(false);
  const [emotionEmoji, setEmotionEmoji] = useState("");
  const isActive = activeTile === stall.id;
  
  // Companion animation
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationFrame(prev => (prev + 1) % 60);
      
      // Randomly change eye direction
      if (animationFrame % 15 === 0) {
        setEyeDirection({ 
          x: Math.random() * 6 - 3, 
          y: Math.random() * 4 - 2 
        });
      }
      
      // Set random emotions
      if (animationFrame % 30 === 0) {
        setIsHappy(Math.random() > 0.3);
        const emotions = ["❤️", "✨", "🎮", "🧩", "💭", "💯"];
        setEmotionEmoji(emotions[Math.floor(Math.random() * emotions.length)]);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [animationFrame]);

  // Get more excited when active
  useEffect(() => {
    if (isActive) {
      setIsHappy(true);
    }
  }, [isActive]);

  // Calculate companion colors based on stall properties
  const primaryColor = stall.bgColor || "#F97316";
  const secondaryColor = "#FBBF24";
  
  // Determine companion type
  const companionType = stall.companionType || "pet";
  
  return (
    <div className="absolute" style={{
      left: `${stall.x}px`,
      top: `${stall.y}px`,
      width: `${stall.width}px`,
      height: `${stall.height}px`,
      zIndex: 20,
    }}>
      {/* Staking Platform */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4/5 h-1/5 rounded-xl overflow-hidden"
        style={{
          background: "linear-gradient(to bottom, #27272A, #18181B)",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)"
        }}>
        {/* Platform grid pattern */}
        <div className="absolute inset-0" style={{ opacity: 0.3 }}>
          {Array.from({ length: 5 }).map((_, idxY) => (
            <div key={`grid-row-${idxY}`} className="flex w-full">
              {Array.from({ length: 8 }).map((_, idxX) => (
                <div 
                  key={`grid-cell-${idxY}-${idxX}`}
                  className="border border-slate-400 flex-1 aspect-square"
                  style={{ opacity: ((idxX + idxY) % 2 === 0) ? 0.3 : 0.1 }}
                />
              ))}
            </div>
          ))}
        </div>
        
        {/* Platform glow */}
        <div className="absolute inset-x-0 bottom-0 h-1/3"
            style={{ 
              background: `linear-gradient(to top, ${primaryColor}40, transparent)`,
              filter: "blur(2px)" 
            }}/>
      </div>
      
      {/* Staking info display */}
      <div className="absolute bottom-1/5 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-full flex justify-center">
        <div className="bg-slate-900 bg-opacity-80 backdrop-blur-sm px-2 py-1 rounded-full text-xs flex items-center gap-2">
          <div className="text-amber-400 font-mono">
            APY: {stall.stakingAPY || "12%"}
          </div>
          <div className="w-px h-3 bg-slate-600"></div>
          <div className="text-amber-400 font-mono">
            Lock: {stall.lockPeriod || "30d"}
          </div>
        </div>
      </div>
      
      {/* Companion container */}
      <div className="absolute bottom-1/5 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/5 h-3/5">
        {/* Companion body */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden"
            style={{ 
              background: `radial-gradient(circle at center, ${primaryColor}, ${secondaryColor})`,
              boxShadow: isActive ? `0 0 20px ${primaryColor}80` : "none",
              transform: `scale(${1 + Math.sin(animationFrame / 10) * 0.03}) ${isHappy ? "translateY(-5px)" : ""}`,
              transition: "transform 0.3s ease-out"
            }}>
          
          {/* Body pattern */}
          {companionType === "pet" && (
            <div className="absolute inset-0">
              {/* Spots or patterns */}
              {Array.from({ length: 5 }).map((_, idx) => (
                <div 
                  key={`pattern-${idx}`}
                  className="absolute rounded-full"
                  style={{
                    width: `${10 + Math.random() * 15}px`,
                    height: `${10 + Math.random() * 15}px`,
                    top: `${10 + Math.random() * 80}%`,
                    left: `${10 + Math.random() * 80}%`,
                    background: secondaryColor,
                    opacity: 0.6
                  }}
                />
              ))}
            </div>
          )}
          
          {companionType === "robot" && (
            <div className="absolute inset-0">
              {/* Circuit pattern */}
              {Array.from({ length: 8 }).map((_, idx) => (
                <div 
                  key={`circuit-${idx}`}
                  className="absolute bg-amber-300 opacity-50"
                  style={{
                    height: "2px",
                    width: `${20 + Math.random() * 40}%`,
                    top: `${10 + idx * 10}%`,
                    left: `${10 + (idx % 3) * 20}%`,
                    transform: idx % 2 === 0 ? "none" : "translateY(5px)"
                  }}
                />
              ))}
              
              {/* Circuit nodes */}
              {Array.from({ length: 5 }).map((_, idx) => (
                <div 
                  key={`node-${idx}`}
                  className="absolute w-2 h-2 bg-amber-300 rounded-full"
                  style={{
                    top: `${15 + idx * 15}%`,
                    left: `${20 + (idx % 3) * 25}%`,
                    opacity: 0.6 + Math.sin(animationFrame / 5 + idx) * 0.4
                  }}
                />
              ))}
            </div>
          )}
        </div>
        
        {/* Face */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {/* Eyes */}
          <div className="flex justify-center gap-4 mb-2">
            <div className="relative w-5 h-5 bg-white rounded-full flex items-center justify-center overflow-hidden">
              <div className="absolute w-3 h-3 bg-black rounded-full" 
                   style={{ 
                     transform: `translate(${eyeDirection.x}px, ${eyeDirection.y}px)`,
                     transition: "transform 0.3s ease-out"
                   }}>
                <div className="absolute top-0 left-1/4 w-1 h-1 bg-white rounded-full opacity-70"></div>
              </div>
            </div>
            <div className="relative w-5 h-5 bg-white rounded-full flex items-center justify-center overflow-hidden">
              <div className="absolute w-3 h-3 bg-black rounded-full"
                   style={{ 
                     transform: `translate(${eyeDirection.x}px, ${eyeDirection.y}px)`,
                     transition: "transform 0.3s ease-out"
                   }}>
                <div className="absolute top-0 left-1/4 w-1 h-1 bg-white rounded-full opacity-70"></div>
              </div>
            </div>
          </div>
          
          {/* Mouth */}
          <div className="mt-1 w-8 h-3 overflow-hidden">
            {isHappy ? (
              // Happy mouth
              <div className="w-8 h-8 border-2 border-black rounded-full" 
                   style={{ 
                     transform: "translateY(-62%)",
                     borderTop: "none",
                     borderLeft: "none",
                     borderRight: "none"
                   }}></div>
            ) : (
              // Neutral mouth
              <div className="w-4 h-1 bg-black mx-auto rounded-full"></div>
            )}
          </div>
        </div>
        
        {/* Companion emotes/bubbles when active */}
        {isActive && (
          <div className="absolute -top-5 -right-2 text-xl animate-bounce">
            {emotionEmoji}
          </div>
        )}
        
        {/* Glowing staking particles */}
        {isActive && Array.from({ length: 8 }).map((_, idx) => (
          <div 
            key={`stake-particle-${idx}`}
            className="absolute w-2 h-2 rounded-full"
            style={{
              background: primaryColor,
              boxShadow: `0 0 5px ${primaryColor}`,
              left: "50%",
              bottom: `${-(idx * 8) - (animationFrame % 20)}%`,
              transform: `translateX(${Math.sin(idx * 0.5) * 20}px)`,
              opacity: 1 - (idx * 0.1),
              animation: `float-up 2s ease-out infinite ${idx * 0.2}s`
            }}
          />
        ))}
      </div>
      
      {/* Companion ears/antennas (depending on type) */}
      {companionType === "pet" && (
        <>
          <div className="absolute left-1/3 bottom-1/2 w-1/6 h-1/4 bg-amber-500 rounded-tl-full rounded-tr-full"
               style={{ 
                 transform: `rotate(-15deg) translateY(-90%) scale(1, ${1 + Math.sin(animationFrame / 8) * 0.1})`,
                 background: primaryColor,
                 transformOrigin: "bottom center"
               }}></div>
          <div className="absolute right-1/3 bottom-1/2 w-1/6 h-1/4 bg-amber-500 rounded-tl-full rounded-tr-full"
               style={{ 
                 transform: `rotate(15deg) translateY(-90%) scale(1, ${1 + Math.sin(animationFrame / 8 + 2) * 0.1})`,
                 background: primaryColor,
                 transformOrigin: "bottom center"
               }}></div>
        </>
      )}
      
      {companionType === "robot" && (
        <>
          <div className="absolute left-2/5 bottom-1/2 w-1/5 h-1/6"
               style={{ 
                 transform: `translateY(-100%) rotate(${-5 + Math.sin(animationFrame / 10) * 5}deg)`,
                 transformOrigin: "bottom center"
               }}>
            <div className="w-1 h-full bg-slate-700 mx-auto">
              <div className="w-3 h-3 rounded-full" 
                   style={{
                     background: primaryColor,
                     boxShadow: `0 0 5px ${primaryColor}`,
                     animation: "pulse 1.5s infinite alternate"
                   }}></div>
            </div>
          </div>
        </>
      )}
      
      {/* Stall name display */}
      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-amber-900 bg-opacity-70 px-3 py-1 rounded-lg backdrop-blur-sm">
        <div className="text-amber-100 text-xs font-bold tracking-wide">
          {stall.name}
        </div>
      </div>
      
      {/* Description when active */}
      {isActive && (
        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-amber-50 p-2 rounded max-w-full border border-amber-300">
          <p className="text-amber-900 text-xs">
            {stall.description}
          </p>
        </div>
      )}
      
      {/* Interaction prompt */}
      {isActive && (
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
          <div className="px-3 py-1 rounded-full text-xs text-white"
               style={{ 
                 background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`,
                 boxShadow: `0 0 10px ${primaryColor}80`
               }}>
            Press Space to stake
          </div>
        </div>
      )}
      
      <style jsx>{`
        @keyframes float-up {
          0% { transform: translateX(0) translateY(0); opacity: 1; }
          100% { transform: translateX(0) translateY(-20px); opacity: 0; }
        }
        
        @keyframes pulse {
          0% { opacity: 0.7; transform: scale(1); }
          100% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
};

export default CompanionStall;