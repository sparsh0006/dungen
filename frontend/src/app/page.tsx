"use client";

import { useRouter } from "next/navigation";
import { WalletConnect } from "@/components/WalletConnect";
import { usePrivy } from "@privy-io/react-auth";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const { authenticated, ready } = usePrivy();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (ready && authenticated) {
      setIsConnected(true);
    }
  }, [ready, authenticated]);

  const handleEnterMarket = () => {
    router.push("/arena");
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-gray-800 rounded-lg shadow-xl overflow-hidden">
        <div className="p-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Crypto-Market</h1>
          <p className="text-gray-300 mb-8">
            A simple interface to interact with your crypto assets
          </p>
          
          <div className="space-y-6">
            <div className="bg-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-3">Features</h2>
              <ul className="text-gray-300 text-left space-y-2">
                <li className="flex items-center">
                  <span className="mr-2">🔄</span> Swap tokens on Rootstock
                </li>
                <li className="flex items-center">
                  <span className="mr-2">💰</span> Check token balances
                </li>
                <li className="flex items-center">
                  <span className="mr-2">📤</span> Transfer tokens easily
                </li>
                <li className="flex items-center">
                  <span className="mr-2">📈</span> Get market information
                </li>
              </ul>
            </div>
            
            <div className="flex flex-col items-center space-y-4">
              {!isConnected ? (
                <WalletConnect 
                  className="w-full py-3"
                  onConnectionChange={setIsConnected}
                />
              ) : (
                <button
                  onClick={handleEnterMarket}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 px-6 rounded-md w-full transition-colors"
                >
                  Enter Market
                </button>
              )}
            </div>
          </div>
        </div>
        
        <div className="bg-gray-900 p-4 border-t border-gray-700">
          <p className="text-gray-400 text-center text-sm">
            Connected to Rootstock blockchain network
          </p>
        </div>
      </div>
    </main>
  );
}