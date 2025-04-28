import express, { Request, Response, Router } from "express";
import { openai } from "@ai-sdk/openai"; // Keep this for now as fallback
import { generateText } from "ai";
import { http } from "viem";
import { createWalletClient } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { baseSepolia } from "viem/chains";
import { getOnChainTools } from "@goat-sdk/adapter-vercel-ai";
import { PEPE, USDC, erc20 } from "@goat-sdk/plugin-erc20";
import { sendETH } from "@goat-sdk/wallet-evm";
import { viem } from "@goat-sdk/wallet-viem";
import { coingecko } from "@goat-sdk/plugin-coingecko";
// Import our custom token swap plugin
import { tokenSwap } from "../plugins/token-swap/src";
// Import Google's Generative AI SDK
import { GoogleGenerativeAI } from "@google/generative-ai";

import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Initialize Google AI
const googleAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY as string);

const router: Router = express.Router();

// Initialize wallet client
const account = privateKeyToAccount(
  process.env.WALLET_PRIVATE_KEY as `0x${string}`
);

const walletClient = createWalletClient({
  account,
  transport: http(process.env.RPC_PROVIDER_URL as string),
  chain: baseSepolia,
});

interface AgentRequestBody {
  prompt: string;
  isRootstock?: boolean;
}

// Agent route
router.post(
  "/message",
  async (
    req: Request<{}, any, AgentRequestBody>,
    res: Response
  ): Promise<void> => {
    const { prompt, isRootstock = false } = req.body;

    if (!prompt || typeof prompt !== "string") {
      res
        .status(400)
        .json({ error: "Prompt is required and must be a string" });
      return;
    }

    try {
      // Get on-chain tools
      const tools = await getOnChainTools({
        wallet: viem(walletClient),
        plugins: [
          sendETH(),
          erc20({ tokens: [USDC, PEPE] }),
          coingecko({
            apiKey: process.env.COINGECKO_API_KEY as string,
          }),
          // Add our token swap plugin
          tokenSwap(),
        ],
      });

     // Change this part
        let systemMessage =
        "You are a personal assistant, quirky and fun. No text formatting, just keep it simple plain text. You have special abilities to check cryptocurrency prices, swap tokens on Rootstock, check token balances, and transfer tokens between wallets. and you can tell the price og bigger cryptocurrencies like bitcoin,ethereum ,etc. You can also check the balance of a wallet address. ";

        // Always use Rootstock info regardless of the flag
        systemMessage +=
        " When using tools, you have access to swap_tokens for exchanging tokens, check_token_balance to see how many tokens a wallet holds, and transfer_token to send tokens from one wallet to another. Available tokens on Rootstock are: RBTC (native token), DOC (Dollar on Chain), RIF (RSK Infrastructure Framework), SOV (Sovryn), BPRO (BitPRO), and RUSDT (Rootstock USDT).";


      // Add a note about Rootstock to the prompt if isRootstock is true
      let enhancedPrompt = prompt;
      if (isRootstock && !prompt.toLowerCase().includes("isrootstock")) {
        enhancedPrompt +=
          " When using swap_tokens, you MUST set isRootstock: true. The available Rootstock tokens are: RBTC, DOC, RIF, SOV, BPRO, RUSDT.";
      }

      // Option 1: Use Google's Gemini model directly (if compatible with your tools setup)
      try {
        const geminiModel = googleAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });
        
        // Check if we need to convert the tools format to be compatible with Gemini
        // This is a simplified example and may need modification
        const geminiResponse = await geminiModel.generateContent({
          contents: [{ role: "user", parts: [{ text: `${systemMessage}\n\n${enhancedPrompt}` }] }],
          // Note: Tool calling with Gemini might require different formatting than what ai-sdk expects
          // You may need to adapt your tools or create a wrapper
        });
        
        const result = geminiResponse.response.text();
        
        res.json({
          response: result,
          toolResults: [] // You'll need to adapt this based on how Gemini returns tool results
        });
        
        return;
      } catch (geminiError) {
        console.error("Gemini error, falling back to OpenAI:", geminiError);
        // Fall back to OpenAI if there's an issue with Gemini
      }

      // Option 2: Fall back to OpenAI (existing implementation)
      const result = await generateText({
        model: openai("gpt-4o-mini"),
        tools,
        maxSteps: 10,
        prompt: enhancedPrompt,
        system: systemMessage,
        onStepFinish: (event) => {
          console.log("Tool Results:", event.toolResults);
        },
      });

      res.json({
        response: result.text,
        toolResults: result.steps?.map((step) => step.toolResults) || [],
      });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default router;