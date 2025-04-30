# DunGen: A Space Odyssey - Bounty Submission

This document outlines the submission details for "DunGen: A Space Odyssey" for the **Best Use of AI Prompts** track.

## Project Overview

*   **Name:** DunGen: A Space Odyssey
*   **Short Description:** DunGen is an interactive, game-like web application built on the Rootstock blockchain. It allows users to navigate a virtual "arena" (themed as a Space Station or Crystal Caverns) and perform cryptocurrency operations (like token swapping, balance checking, and transfers) simply by using natural voice commands. The core innovation is its AI-powered agent that interprets user speech, extracts parameters, and executes corresponding blockchain actions, aiming to make DeFi more accessible and engaging.
*   **Track:** Best Use of AI Prompts

## AI Process Documentation

This project deeply integrated AI across its lifecycle, from conceptualization and development to the final user-facing features.

**1. AI Models & Services Used:**

| Model/Service       | Provider    | Use Case                                                    | Key Benefits                                                 |
| :------------------ | :---------- | :---------------------------------------------------------- | :----------------------------------------------------------- |
| Gemini 1.5 Pro      | Google      | **Primary NLP Model:** Intent/parameter extraction for voice | Fast, cost-effective, strong parameter extraction            |
| GPT-4o-mini         | OpenAI      | **Fallback NLP Model:** Redundancy for NLP tasks            | Different strengths, ensures service continuity              |
| Claude 3.7 Sonnet   | Anthropic   | **Code Generation:** Smart Contracts (Solidity)              | Excellent understanding of complex blockchain requirements   |
| Claude 3.7 Sonnet   | Anthropic   | **Code Generation:** Backend Plugin Architecture (TS)       | Generated modular, extensible code following instructions    |
| Claude 3.7 Sonnet   | Anthropic   | **Code Generation:** Frontend UI Components (React/Tailwind) | Strong visual design understanding, generated themed elements |
| GOAT SDK            | Goat.dev    | **AI Tool Framework:** Structuring agent tools              | Specialized for AI tools on blockchain, Vercel AI adapter    |
| ElevenLabs (Planned) | ElevenLabs  | **Text-to-Speech:** Agent voice responses                   | Natural-sounding voice feedback for enhanced UX (mentioned in docs) |
| Browser Speech API  | Browser Vendors | **Speech-to-Text:** Capturing user voice input            | Native browser integration                                   |

**2. AI Integration Methods:**

*   **Agent-Based Architecture:** The core backend (`agent`) utilizes a tool-based agent architecture. An AI model (Gemini/GPT) acts as the central coordinator. It receives transcribed user speech, understands the intent (e.g., "swap," "check balance"), selects the appropriate custom tool (defined using GOAT SDK, like `swap_tokens`), extracts necessary parameters (token names, amounts, addresses), and instructs the backend to execute the tool. The tool then interacts with the blockchain (via Viem), and the result is used by the AI to generate a natural language response.
*   **Natural Language Processing (NLP):** The primary user interaction relies on the AI's ability to parse natural language requests specific to Rootstock DeFi operations. Prompt engineering was crucial here to constrain the domain (specific tokens, actions) and guide parameter extraction.
*   **Multimodal Interaction:** The system combines:
    *   **Voice Input:** Captured via the browser's SpeechRecognition API.
    *   **AI Processing:** Handled by the backend agent using Gemini/GPT.
    *   **Tool Execution:** Custom Typescript tools (`token-swap` plugin) interacting with Rootstock via Viem.
    *   **Visual Feedback:** UI updates (processing indicators, speech bubbles) in the React frontend.
    *   **(Planned) Audio Feedback:** Using Text-to-Speech (ElevenLabs) for agent responses.

**3. AI in Development Workflow:**

AI significantly accelerated development and enabled complex features:

*   **Smart Contract Generation (Claude):** The foundational `spaceStationRootstock.sol` contract for token swapping was generated using a detailed prompt specifying Rootstock, desired tokens, functions, safety checks, gas efficiency, and Solidity version. This saved significant Solidity development time.
*   **Backend Plugin Architecture (Claude):** The modular `token-swap` plugin structure within the agent, including tool definitions and basic Viem integration logic, was designed and partially generated using AI prompts, promoting extensibility.
*   **UI Component Generation (Claude):** Specialized, themed frontend components (`HologramStall`, `PlantStall`, `PortalStall`, `ArtifactStall`, `CompanionStall`) were generated using prompts requesting specific visual themes (space/cave), animations, interactivity, and styling (React/Tailwind), allowing for a richer UI with less manual effort.

**4. Prompt Engineering Techniques:**

Effective AI interaction was achieved through careful prompt engineering:

*   **Domain Constraint Specification:** Explicitly listing the available Rootstock tokens (RBTC, DOC, RIF, etc.) and operations dramatically improved the AI's accuracy and reduced hallucinations.
*   **Structured Parameter Extraction:** Prompts clearly defined the parameters needed for each action (e.g., `swap: from_token, amount, to_token`), guiding the AI.
*   **Response Format Direction:** Instructions were given on *how* the AI should respond for different outcomes (e.g., confirm swaps, format balances), ensuring user-friendliness.
*   **Personality Guidance:** Adding traits like "quirky and fun" directly into the system prompt shaped the agent's conversational style to match the application's tone.
*   **Few-Shot Learning:** Examples of input and desired parameter extraction were included in prompts during development/testing to guide the AI.
*   **Contextual Augmentation:** The frontend automatically appends the user's wallet address to the prompt, providing necessary context for the AI without requiring the user to state it.
*   **Iterative Refinement:** Prompts were continuously tested and refined based on error analysis and user feedback, moving from basic intent recognition to the final rich, contextual prompt (detailed in `PROMPT_ENGINEERING_INSIGHTS.md`).


## Prompt Submission

Below are key examples of prompts used in DunGen, demonstrating how AI was leveraged.

**(Format: Markdown)**

---

### Prompt 1: Core Voice Control & Transaction Agent

*   **AI Model Used:** Google Gemini 1.5 Pro (Primary), OpenAI GPT-4o-mini (Fallback)
*   **Use Case / Purpose:** This is the main system prompt for the backend agent. It defines the agent's persona, capabilities, constraints (Rootstock tokens), and how it should process user voice commands for cryptocurrency operations and interact with defined tools.
*   **Prompt Text:**
    ```markdown
    You are a personal assistant, quirky and fun. No text formatting, just keep it simple plain text. You have special abilities to check cryptocurrency prices, swap tokens on Rootstock, check token balances, and transfer tokens between wallets. You can also tell the price of bigger cryptocurrencies like bitcoin, ethereum, etc. You can also check the balance of a wallet address.

    When using tools, you have access to swap_tokens for exchanging tokens, check_token_balance to see how many tokens a wallet holds, and transfer_token to send tokens from one wallet to another.

    Available tokens on Rootstock are: RBTC (native token), DOC (Dollar on Chain), RIF (RSK Infrastructure Framework), SOV (Sovryn), BPRO (BitPRO), and RUSDT (Rootstock USDT).

    When users speak to you, extract the intent and parameters for token operations like:
    1. Swapping tokens (identify: from_token, amount, to_token, wallet_address)
    2. Checking balances (identify: token, wallet_address)
    3. Transferring tokens (identify: token, amount, from_address, to_address) - Note: use the provided wallet_address as from_address if not specified.
    4. Getting token prices (identify: token)

    Respond in a friendly, conversational way. After identifying the operation and parameters:
    - For swaps: Confirm the tokens and amount before executing the tool, then report success/failure.
    - For balance checks: Provide the balance in a readable format after executing the tool.
    - For transfers: Double-check the target address and amount before executing the tool, then report success/failure.
    - For price checks: Present the price clearly after getting it from the tool.

    Always maintain your quirky, fun personality in responses. Keep responses concise. If a required parameter like a token name or amount is missing, ask the user for it conversationally. Use the walletAddress provided in the user prompt context for operations unless explicitly told otherwise.
    ```
*   **Explanation / Key Features:**
    *   **Persona:** Defines the "quirky and fun" personality.
    *   **Capabilities:** Clearly lists what the agent *can* do (swap, check balance, transfer, price check).
    *   **Domain Constraints:** Explicitly lists the *only* valid Rootstock tokens, significantly boosting accuracy.
    *   **Tool Definition:** Informs the AI about the available tools (`swap_tokens`, `check_token_balance`, `transfer_token`) and their purpose.
    *   **Structured Extraction:** Tells the AI exactly which parameters to identify for each intent.
    *   **Context Handling:** Instructs the AI to use the `walletAddress` provided implicitly in the prompt.
    *   **Response Guidance:** Dictates conversational flow and confirmation steps for different actions.
    *   **Error Handling:** Includes instruction to ask for missing parameters.
*   **Example Interaction:**
    *   *User Input (Frontend adds address):* "Swap 10 RUSDT to RIF tokens : my wallet address is 0x123..."
    *   *AI identifies:* intent=swap, from_token=RUSDT, amount=10, to_token=RIF, wallet_address=0x123...
    *   *AI determines:* Call `swap_tokens` tool.
    *   *Agent executes:* Calls the `swap_tokens` tool code, which interacts with Viem and the smart contract.
    *   *Agent receives result:* Transaction hash `0xabc...`
    *   *AI generates response:* "You got it! Swapping 10 RUSDT for RIF right away. Transaction sent to the stars (Rootstock)! Hash: 0xabc..."

---

### Prompt 2: Smart Contract Generation (Rootstock Token Swap)

*   **AI Model Used:** Anthropic Claude 3.7 Sonnet
*   **Use Case / Purpose:** To generate the initial Solidity code for the `spaceStationRootstock.sol` contract, providing the core token swap functionality on the Rootstock network.
*   **Prompt Text:**
    ```markdown
    Create a Solidity smart contract for a token swap platform on the Rootstock blockchain (RSK). The contract should:
    1.  Allow users to swap specific Rootstock tokens: primarily swapping FROM "RUSDT" (address: 0xEf213441A85DF4d7ACBdAe0Cf78004E1e486BB96) TO one of the following: "RBTC" (use WETH address for RSK: 0x542fDA317318eBF1d3DEAf76E0b632741A7e677d), "DOC" (0xe700691dA7b9851F2F35f8b8182c69c53CcaD9Db), "RIF" (0x2aCC95758f8b5F583470bA265Eb685a8f45fC9D5), "SOV" (0xEFc78fc7d48b64958315949279Ba181c2114ABBd), "BPRO" (0x440bBd6a888a36DE6e2F6A25f65bc4e16874faa9).
    2.  Include a primary function `swap(uint256 rusdtAmount, address tokenOut, address userWallet)` that takes the amount of RUSDT to swap, the address of the desired output token, and the user's wallet address.
    3.  Inside the `swap` function:
        a. Transfer `rusdtAmount` of RUSDT from `userWallet` to this contract.
        b. Approve a known Rootstock Swap Router (use placeholder address: 0x0B14ff67f0014046b4b99057Aec4509640b3947A) to spend the received RUSDT.
        c. Call the `exactInputSingle` function on the Swap Router, specifying RUSDT as `tokenIn`, `tokenOut` as the target token, a fee tier (e.g., 3000), and ensuring the swapped tokens (`amountOut`) are sent directly back to the `userWallet`.
        d. Return the amount of `tokenOut` received.
    4.  Include necessary IERC20 interface and ISwapRouter interface (for `ExactInputSingleParams`).
    5.  Implement necessary safety checks (e.g., non-zero amounts) and basic error handling.
    6.  Prioritize gas-efficiency where possible.
    7.  Follow best practices for Solidity version 0.8.19 or higher.
    8.  Include an owner-only function to recover accidentally sent ERC20 tokens or native RBTC.
    ```
*   **Explanation / Key Features:**
    *   **Platform Specificity:** Clearly targets Rootstock and specific token addresses.
    *   **Function Definition:** Defines the exact function signature and internal logic step-by-step.
    *   **Interaction Points:** Specifies the external router address and function to call (`exactInputSingle`).
    *   **Requirements:** Explicitly asks for safety, gas efficiency, interfaces, Solidity version, and recovery functions.
*   **Impact:** Generated a functional and secure base contract (`spaceStationRootstock.sol`) that correctly implemented the core swap logic, significantly reducing manual coding time for blockchain specifics.

---

### Prompt 3: Themed UI Component Generation (React/Tailwind)

*   **AI Model Used:** Anthropic Claude 3.7 Sonnet
*   **Use Case / Purpose:** To generate visually distinct and interactive "stall" components for the frontend arena, matching the "space" and "cave" themes. Used for components like `HologramStall.tsx`, `PortalStall.tsx`, etc.
*   **Prompt Text (Example for a generic themed stall concept):**
    ```markdown
    Create a React functional component using TypeScript for a "Stall" within a virtual marketplace, intended for use in a Next.js application. Style it using Tailwind CSS.

    The component should meet these requirements:
    1.  Accept a `stall` prop containing its data (id, name, x, y, width, height, icon, description) and a `theme` prop ("space" or "cave").
    2.  Accept an `activeTile` prop (number or null) to know if the user is interacting with this stall.
    3.  **Theming:**
        *   If `theme` is "space", the stall should look futuristic, metallic, possibly with glowing blue/cyan elements, maybe some subtle grid patterns or blinking lights. Use darker blues and grays.
        *   If `theme` is "cave", the stall should look rustic, made of stone or wood, possibly with glowing orange/amber elements (like crystals or torches). Use browns, grays, and amber/orange tones.
    4.  **Visual State:** When `activeTile` matches the stall's `id`, apply a distinct visual effect (e.g., brighter glow, outline, subtle animation) to indicate it's active.
    5.  **Content:** Display the `stall.name` prominently and the `stall.icon` as the main visual element. Show the `stall.description` only when the stall is active.
    6.  **Animation:** Include subtle animations. For "space", maybe a slow pulse or floating effect. For "cave", maybe a flickering light effect or subtle texture movement. The `icon` could have a simple animation when active.
    7.  **Interaction Cue:** When active, display a small text element like "Press Space to interact" near the bottom.
    8.  **Structure:** Use modern React (functional components, hooks) and Tailwind CSS utility classes for all styling. Ensure it's a self-contained component.
    9.  Include basic accessibility considerations (though visuals are primary here).
    ```
*   **Explanation / Key Features:**
    *   **Component Definition:** Clearly defines props (`stall`, `theme`, `activeTile`).
    *   **Conditional Theming:** Explicit instructions for different visual styles based on the `theme` prop.
    *   **State-Based Styling:** Specifies visual changes based on the `activeTile` prop.
    *   **Content Display Logic:** Dictates what information is shown and when (e.g., description only when active).
    *   **Animation Guidance:** Suggests theme-appropriate subtle animations.
*   **Impact:** Allowed for rapid creation of diverse, themed UI elements like `HologramStall`, `PortalStall`, etc., contributing significantly to the visual appeal and immersive quality of the arena without extensive manual frontend design work.

---
