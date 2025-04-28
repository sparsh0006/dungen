"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import { useSocket, PlayerData } from "../../contexts/SocketContext";
import axios from "axios";

// Import components
import Background from "./components/Background";
import Stall from "./components/Stall";
import Character from "./components/Character";
import ControlsUI from "./components/ControlsUI";
import EmoteMenu from "./components/EmoteMenu";
import UsernameInput from "./components/UsernameInput";
import TeamModals from "./components/TeamModals";
import SpeechRecognitionUi from "./components/SpeechRecognition";
import HeaderUI from "./components/HeaderUI";
import TeamButtons from "./components/TeamButtons";

// Import types
import SpeechRecognition from "./types/speechRecognition";

export default function Arena() {
  const [position, setPosition] = useState({ x: 600, y: 300 });
  const [showControls, setShowControls] = useState(true);
  const [activeTile, setActiveTile] = useState<number | null>(null);
  const [showEmoteMenu, setShowEmoteMenu] = useState(false);
  const [currentEmote, setCurrentEmote] = useState<string | null>(null);
  const [username, setUsername] = useState("Guest");
  const [showNameInput, setShowNameInput] = useState(false);
  const [viewportSize, setViewportSize] = useState({
    width: 1200,
    height: 600,
  });
  const [isCreatingTeam, setIsCreatingTeam] = useState(false);
  const [isJoiningTeam, setIsJoiningTeam] = useState(false);
  const [joinTeamInput, setJoinTeamInput] = useState("");
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [agentResponse, setAgentResponse] = useState<string | null>(null);

  const router = useRouter();
  const { user, authenticated } = usePrivy();
  const {
    socket,
    isConnected,
    createRoom,
    joinRoom,
    leaveRoom,
    roomCode,
    players,
    error: socketError,
  } = useSocket();

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isStartingRef = useRef<boolean>(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const walletAddress = user?.wallet?.address || "";
  const formattedAddress = walletAddress
    ? `${walletAddress.substring(0, 6)}...${walletAddress.substring(
        walletAddress.length - 4
      )}`
    : "";

  useEffect(() => {
    if (!authenticated) {
      router.push("/");
    }
  }, [authenticated, router]);

  useEffect(() => {
    const updateViewportSize = () => {
      setViewportSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    updateViewportSize();
    window.addEventListener("resize", updateViewportSize);
    return () => window.removeEventListener("resize", updateViewportSize);
  }, []);

  // Speech recognition setup
  useEffect(() => {
    if (
      !("webkitSpeechRecognition" in window) &&
      !("SpeechRecognition" in window)
    ) {
      console.warn("Speech recognition not supported. Use Chrome or Safari.");
      return;
    }

    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      console.warn("Speech recognition not supported in this browser.");
      return;
    }

    recognitionRef.current = new SpeechRecognitionAPI();
    const recognition = recognitionRef.current;

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsRecording(true);
      isStartingRef.current = false;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };

    recognition.onend = () => {
      setIsRecording(false);
      isStartingRef.current = false;
    };

    recognition.onerror = (event) => {
      setError(`Speech recognition error: ${event.error}`);
      isStartingRef.current = false;
      setIsRecording(false);
    };

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setIsProcessing(true);
      sendToAgent(`${text}: my wallet address is ${walletAddress}`);
    };

    audioRef.current = new Audio();

    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const step = 10;
  const characterSize = { width: 32, height: 32 }; // Adjusted to be a circle
  const tileSize = 32;

  const toggleControlsVisibility = () => {
    setShowControls(!showControls);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (showEmoteMenu) {
        setShowEmoteMenu(false);
        return;
      }

      if (showNameInput) {
        return;
      }

      if (event.key === "x") {
        setShowEmoteMenu((prev) => !prev);
        return;
      }

      if (event.key === "e" && activeTile !== null) {
        console.log(`Interacting with stall ${activeTile}`);
        return;
      }

      if (event.code === "Space" && activeTile !== null) {
        event.preventDefault();
        if (!isRecording && !isStartingRef.current && recognitionRef.current) {
          try {
            if (audioRef.current) {
              audioRef.current.pause();
              audioRef.current.src = "";
            }
            setError(null);
            setAgentResponse(null);
            isStartingRef.current = true;
            recognitionRef.current.stop();
            recognitionRef.current.start();
          } catch (err) {
            setError(`Failed to start recognition: ${(err as Error).message}`);
            isStartingRef.current = false;
          }
        }
        return;
      }

      setPosition((prevPosition) => {
        let newX = prevPosition.x;
        let newY = prevPosition.y;

        switch (event.key) {
          case "ArrowUp":
            newY = Math.max(0, prevPosition.y - step);
            break;
          case "ArrowDown":
            newY = Math.min(
              viewportSize.height - characterSize.height,
              prevPosition.y + step
            );
            break;
          case "ArrowLeft":
            newX = Math.max(0, prevPosition.x - step);
            break;
          case "ArrowRight":
            newX = Math.min(
              viewportSize.width - characterSize.width,
              prevPosition.x + step
            );
            break;
          default:
            return prevPosition;
        }

        checkNearbyStalls({ x: newX, y: newY });
        if (currentEmote) setCurrentEmote(null);
        return { x: newX, y: newY };
      });
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (
        event.code === "Space" &&
        isRecording &&
        recognitionRef.current &&
        activeTile !== null
      ) {
        recognitionRef.current.stop();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    checkNearbyStalls(position);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [
    position,
    activeTile,
    showEmoteMenu,
    currentEmote,
    showNameInput,
    viewportSize,
    isRecording,
  ]);

  const checkNearbyStalls = (pos: { x: number; y: number }) => {
    const nearbyStall = stalls.find(
      (stall) =>
        Math.abs(
          pos.x + characterSize.width / 2 - (stall.x + stall.width / 2)
        ) < 80 &&
        Math.abs(
          pos.y + characterSize.height / 2 - (stall.y + stall.height / 2)
        ) < 80
    );
    setActiveTile(nearbyStall ? nearbyStall.id : null);
  };

  const sendToAgent = async (prompt: string) => {
    try {
      // Check if the prompt includes Rootstock-related keywords (case insensitive)
      const lowercasedPrompt = prompt.toLowerCase();
      const isRootstock =
        lowercasedPrompt.includes("rootstock") ||
        lowercasedPrompt.includes("rbtc") ||
        lowercasedPrompt.includes("rusdt") ||
        lowercasedPrompt.includes("doc") ||
        lowercasedPrompt.includes("rif") ||
        lowercasedPrompt.includes("sov") ||
        lowercasedPrompt.includes("bpro");

      console.log(`Detected Rootstock: ${isRootstock}`);

      const response = await axios.post(
        "http://localhost:3000/api/agent/message",
        {
          prompt,
          isRootstock, // Pass isRootstock flag to the agent API
        },
        { headers: { "Cache-Control": "no-cache" } }
      );
      const agentText = response.data.response;
      setAgentResponse(agentText);
      await generateElevenLabsTTS(agentText);
    } catch (err) {
      setError(`Agent error: ${(err as Error).message || "Unknown error"}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const generateElevenLabsTTS = async (text: string) => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY;
      if (!apiKey) throw new Error("ElevenLabs API key not configured");

      const voiceId = "21m00Tcm4TlvDq8ikWAM";
      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`,
        {
          method: "POST",
          headers: {
            Accept: "audio/mpeg",
            "Content-Type": "application/json",
            "xi-api-key": apiKey,
          },
          body: JSON.stringify({
            text,
            model_id: "eleven_monolingual_v1",
            voice_settings: { stability: 0.5, similarity_boost: 0.5 },
          }),
        }
      );

      if (!response.ok)
        throw new Error("Failed to generate TTS from ElevenLabs");

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = audioUrl;
        audioRef.current.play().catch((e) => {
          setError("Audio playback error: " + e.message);
        });
      }
    } catch (err) {
      setError(`TTS error: ${(err as Error).message || "Unknown error"}`);
    }
  };

  const handleEmoteSelect = (emote: string) => {
    setCurrentEmote(emote);
    setShowEmoteMenu(false);
  };

  const handleUsernameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowNameInput(false);
  };

  const returnToHome = () => {
    router.push("/");
  };

  // Update the stalls to be simpler market sections
  const stalls = [
    {
      id: 1,
      name: "Token Swap",
      x: viewportSize.width * 0.25 - 90,
      y: viewportSize.height * 0.35,
      width: 160,
      height: 100,
      bgColor: "bg-blue-800",
      icon: "🔄",
      description: "Swap your tokens on Rootstock blockchain",
    },
    {
      id: 2,
      name: "Staking Portal",
      x: viewportSize.width * 0.2 - 90,
      y: viewportSize.height * 0.7,
      width: 160,
      height: 100,
      bgColor: "bg-indigo-800",
      icon: "📈",
      description: "Stake your assets and earn rewards",
    },
    {
      id: 3,
      name: "Market Info",
      x: viewportSize.width * 0.5 - 90,
      y: viewportSize.height * 0.25,
      width: 160,
      height: 100,
      bgColor: "bg-cyan-800",
      icon: "ℹ️",
      description: "Get information about crypto markets",
    },
    {
      id: 4,
      name: "Price Oracle",
      x: viewportSize.width * 0.45 - 90,
      y: viewportSize.height * 0.6,
      width: 160,
      height: 100,
      bgColor: "bg-teal-800",
      icon: "💰",
      description: "Get the latest token price data",
    },
    {
      id: 7,
      name: "Balance Checker",
      x: viewportSize.width * 0.8 - 90,
      y: viewportSize.height * 0.28,
      width: 160,
      height: 100,
      bgColor: "bg-emerald-800",
      icon: "💼",
      description: "Check your token balances on Rootstock",
    },
    {
      id: 8,
      name: "Transfer Tokens",
      x: viewportSize.width * 0.7 - 90,
      y: viewportSize.height * 0.55,
      width: 160,
      height: 100,
      bgColor: "bg-purple-800",
      icon: "📤",
      description: "Transfer tokens to other wallets",
    },
  ];

  const emotes = ["👋", "👍", "❤️", "😂", "🎉", "🤔", "👀", "🙏"];

  const generateTeamCode = () => {
    createRoom();
  };

  const handleCreateTeam = () => {
    setIsCreatingTeam(true);
    setIsJoiningTeam(false);
    generateTeamCode();
  };

  const handleJoinTeam = () => {
    setIsJoiningTeam(true);
    setIsCreatingTeam(false);
  };

  const handleJoinTeamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    joinRoom(joinTeamInput);
    setIsJoiningTeam(false);
  };

  const closeTeamModals = () => {
    setIsCreatingTeam(false);
    setIsJoiningTeam(false);
  };

  const handleLeaveRoom = () => {
    if (roomCode) {
      leaveRoom(roomCode);
    }
    setJoinTeamInput("");
  };

  useEffect(() => {
    if (socket && isConnected && roomCode) {
      socket.emit("player_move", { roomCode, position });
    }
  }, [position, socket, isConnected, roomCode]);

  useEffect(() => {
    if (socket && isConnected && roomCode && currentEmote) {
      socket.emit("player_emote", { roomCode, emote: currentEmote });
    }
  }, [currentEmote, socket, isConnected, roomCode]);

  useEffect(() => {
    if (socket && isConnected && roomCode && username) {
      socket.emit("player_name", { roomCode, username });
    }
  }, [username, socket, isConnected, roomCode]);

  return (
    <main className="relative w-full h-screen overflow-hidden bg-gray-900">
      <HeaderUI
        formattedAddress={formattedAddress}
        returnToHome={returnToHome}
        roomCode={roomCode}
        handleLeaveRoom={handleLeaveRoom}
      />

      <TeamButtons
        roomCode={roomCode}
        isConnected={isConnected}
        socketError={socketError}
        handleCreateTeam={handleCreateTeam}
        handleJoinTeam={handleJoinTeam}
      />

      <TeamModals
        isCreatingTeam={isCreatingTeam}
        isJoiningTeam={isJoiningTeam}
        roomCode={roomCode}
        joinTeamInput={joinTeamInput}
        setJoinTeamInput={setJoinTeamInput}
        closeTeamModals={closeTeamModals}
        handleJoinTeamSubmit={handleJoinTeamSubmit}
        socketError={socketError}
      />

      <Background
        viewportSize={viewportSize}
        tileSize={tileSize}
      />

      {stalls.map((stall) => (
        <Stall key={stall.id} stall={stall} activeTile={activeTile} />
      ))}

      <Character
        position={position}
        username={username}
        currentEmote={currentEmote}
        characterSize={characterSize}
      />

      {roomCode &&
        Object.values(players).map((player: PlayerData) => {
          if (socket && player.id === socket.id) return null;
          return (
            <Character
              key={player.id}
              position={player.position}
              username={player.username}
              currentEmote={player.emote}
              characterSize={characterSize}
              isOtherPlayer={true}
            />
          );
        })}

      {showEmoteMenu && (
        <EmoteMenu
          position={position}
          emotes={emotes}
          handleEmoteSelect={handleEmoteSelect}
        />
      )}

      {showNameInput && (
        <UsernameInput
          username={username}
          setUsername={setUsername}
          handleUsernameSubmit={handleUsernameSubmit}
        />
      )}

      <SpeechRecognitionUi
        position={position}
        activeTile={activeTile}
        isRecording={isRecording}
        isProcessing={isProcessing}
        error={error}
        agentResponse={agentResponse}
      />

      <ControlsUI
        showControls={showControls}
        toggleControlsVisibility={toggleControlsVisibility}
        setShowNameInput={setShowNameInput}
      />
    </main>
  );
}