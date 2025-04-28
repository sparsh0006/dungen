import {
  Chain,
  PluginBase,
  WalletClientBase,
  createTool,
} from "@goat-sdk/core";
import { z } from "zod";
import { ROOTSTOCK_TOKENS, getTokenAddress, getTokenName } from "./tokens";
import { createWalletClient, createPublicClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { rootstock } from "viem/chains";


export class TokenSwapPlugin extends PluginBase<WalletClientBase> {
  constructor() {
    super("tokenSwap", []);
  }

  // This plugin supports Rootstock chain
  supportsChain = (chain: Chain) => true;

  // Define tools directly in the plugin
  getTools(walletClient: WalletClientBase) {
    return [
      createTool(
        {
          name: "swap_tokens",
          description: "Swap one token for another on Rootstock",
          parameters: z.object({
            fromToken: z.string().describe("The token to swap from"),
            amount: z.string().describe("The amount to swap"),
            toToken: z.string().optional().describe("The token to swap to"),
            walletAddress: z
              .string()
              .describe("The wallet address to use for the swap"),
          }),
        },
        async (parameters) => {
          try {
            console.warn(parameters);
            const fromToken = parameters.fromToken;
            const toToken = parameters.toToken;

            if (!toToken) {
              throw new Error("toToken is required");
            }

            // Look up token addresses
            const fromTokenAddress = getTokenAddress(fromToken);
            const toTokenAddress = getTokenAddress(toToken);

            if (!fromTokenAddress) {
              throw new Error(`Unknown token: ${fromToken}`);
            }

            if (!toTokenAddress) {
              throw new Error(`Unknown token: ${toToken}`);
            }

            const account = privateKeyToAccount(process.env.WALLET_PRIVATE_KEY as `0x${string}`);

            console.log("Account:", account);

            // Always use Rootstock
            const chain = rootstock;
            const contractAddress = "0xF9816F5CD44092F6d57b167b559fA237069Fe0FF";

            // Always use Rootstock RPC URL
            const rpcUrl = "https://mycrypto.rsk.co";

            const walletClient = createWalletClient({
              account,
              transport: http(rpcUrl),
              chain,
            });

            // Convert the amount to Wei - making sure to handle decimal amounts correctly
            // For USDC, we use 6 decimals as per token standard
            const amountFloat = parseFloat(parameters.amount);
            if (isNaN(amountFloat) || amountFloat <= 0) {
              throw new Error("Invalid amount. Must be a positive number.");
            }

            // For small amounts, need to ensure we're not rounding down to zero
            // Minimum amount should be at least 1 (one unit in the smallest denomination)
            const amountInWei = Math.max(1, Math.floor(amountFloat * 10 ** 6));

            console.log([
              BigInt(amountInWei),
              toTokenAddress as `0x${string}`,
              parameters.walletAddress as `0x${string}`,
            ]);

            const hash = await walletClient.writeContract({
              address: contractAddress as `0x${string}`,
              abi: [
                {
                  inputs: [
                    {
                      internalType: "uint256",
                      name: "usdcAmount",
                      type: "uint256",
                    },
                    {
                      internalType: "address",
                      name: "_tokenOut",
                      type: "address",
                    },
                    {
                      internalType: "address",
                      name: "_userWallet",
                      type: "address",
                    },
                  ],
                  name: "swap",
                  outputs: [
                    {
                      internalType: "uint256",
                      name: "wethAmount",
                      type: "uint256",
                    },
                  ],
                  stateMutability: "nonpayable",
                  type: "function",
                },
              ],
              functionName: "swap",
              args: [
                BigInt(amountInWei),
                toTokenAddress as `0x${string}`,
                parameters.walletAddress as `0x${string}`,
              ],
            });
            console.log("Transaction hash:", hash);

            return {
              tokenName: fromToken,
              tokenAddress: fromTokenAddress,
              amount: parameters.amount,
              walletAddress: parameters.walletAddress,
              toToken: toToken,
              toTokenAddress: toTokenAddress,
              transactionHash: hash,
              chain: "Rootstock",
            };
          } catch (error) {
            console.error("Error in swap_tokens:", error);

            // Return a user-friendly error with details
            return {
              success: false,
              error: `Failed to swap tokens: ${
                (error as Error).message || "Unknown error"
              }`,
              details:
                "The token swap transaction could not be completed. Please try again with a larger amount or different token pair.",
            };
          }
        }
      ),
      createTool(
        {
          name: "get_token_address",
          description: "Get the address for a given token name on Rootstock",
          parameters: z.object({
            tokenName: z.string().describe("The name of the token"),
          }),
        },
        async (parameters) => {
          const address = getTokenAddress(parameters.tokenName);
          return {
            tokenName: parameters.tokenName,
            address: address || "Token not found",
            found: !!address,
          };
        }
      ),
      createTool(
        {
          name: "check_token_balance",
          description: "Check the balance of a token for a given wallet on Rootstock",
          parameters: z.object({
            tokenName: z.string().describe("The name of the token to check"),
            walletAddress: z.string().describe("The wallet address to check the balance for"),
          }),
        },
        async (parameters) => {
          try {
            const tokenAddress = getTokenAddress(parameters.tokenName);
            if (!tokenAddress) {
              throw new Error(`Unknown token: ${parameters.tokenName}`);
            }
      
            const account = privateKeyToAccount(process.env.WALLET_PRIVATE_KEY as `0x${string}`);
            const chain = rootstock;
            const rpcUrl = "https://mycrypto.rsk.co";
      
                        // Instead of using walletClient for reading
            const publicClient = createPublicClient({
              transport: http(rpcUrl),
              chain,
            });

            // Then use publicClient for the read operation
            const balance = await publicClient.readContract({
              address: tokenAddress as `0x${string}`,
              abi: [
                {
                  inputs: [{ internalType: "address", name: "account", type: "address" }],
                  name: "balanceOf",
                  outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
                  stateMutability: "view",
                  type: "function",
                },
              ],
              functionName: "balanceOf",
              args: [parameters.walletAddress as `0x${string}`],
            });
      
            // Most tokens use 18 decimals, but some (like USDC) use 6
            // You might need to adjust this based on the specific token
            const decimals = parameters.tokenName.toUpperCase() === "RUSDT" ? 6 : 18;
            const balanceFormatted = Number(balance) / 10 ** decimals;
      
            return {
              tokenName: parameters.tokenName,
              tokenAddress,
              walletAddress: parameters.walletAddress,
              balance: balanceFormatted.toString(),
              rawBalance: balance.toString(),
            };
          } catch (error) {
            console.error("Error checking token balance:", error);
            return {
              success: false,
              error: `Failed to check token balance: ${(error as Error).message || "Unknown error"}`,
            };
          }
        }
      ),
      createTool(
        {
          name: "transfer_token",
          description: "Transfer tokens from one wallet to another on Rootstock",
          parameters: z.object({
            tokenName: z.string().describe("The name of the token to transfer"),
            amount: z.string().describe("The amount to transfer"),
            fromWallet: z.string().describe("The wallet address to transfer from"),
            toWallet: z.string().describe("The wallet address to transfer to"),
          }),
        },
        async (parameters) => {
          try {
            const tokenAddress = getTokenAddress(parameters.tokenName);
            if (!tokenAddress) {
              throw new Error(`Unknown token: ${parameters.tokenName}`);
            }
      
            const account = privateKeyToAccount(process.env.WALLET_PRIVATE_KEY as `0x${string}`);
            const chain = rootstock;
            const rpcUrl = "https://mycrypto.rsk.co";
      
            const walletClient = createWalletClient({
              account,
              transport: http(rpcUrl),
              chain,
            });
      
            // Convert the amount to Wei - handling decimal amounts
            const amountFloat = parseFloat(parameters.amount);
            if (isNaN(amountFloat) || amountFloat <= 0) {
              throw new Error("Invalid amount. Must be a positive number.");
            }
      
            // Adjust decimals based on token
            const decimals = parameters.tokenName.toUpperCase() === "RUSDT" ? 6 : 18;
            const amountInWei = BigInt(Math.floor(amountFloat * 10 ** decimals));
      
            // Send the transfer transaction
            const hash = await walletClient.writeContract({
              address: tokenAddress as `0x${string}`,
              abi: [
                {
                  inputs: [
                    { internalType: "address", name: "to", type: "address" },
                    { internalType: "uint256", name: "amount", type: "uint256" }
                  ],
                  name: "transfer",
                  outputs: [{ internalType: "bool", name: "", type: "bool" }],
                  stateMutability: "nonpayable",
                  type: "function",
                },
              ],
              functionName: "transfer",
              args: [
                parameters.toWallet as `0x${string}`,
                amountInWei
              ],
            });
      
            return {
              tokenName: parameters.tokenName,
              tokenAddress,
              amount: parameters.amount,
              fromWallet: parameters.fromWallet,
              toWallet: parameters.toWallet,
              transactionHash: hash,
              chain: "Rootstock",
            };
          } catch (error) {
            console.error("Error transferring tokens:", error);
            return {
              success: false,
              error: `Failed to transfer tokens: ${(error as Error).message || "Unknown error"}`,
              details: "The token transfer could not be completed. Please check your wallet has sufficient balance and try again.",
            };
          }
        }
      )
    ];
  }
}

// Export a factory function to create a new instance of the plugin
export const tokenSwap = () => new TokenSwapPlugin();