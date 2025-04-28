# AI Prompts Used in DunGen

This document provides a comprehensive overview of the AI prompts and techniques used in developing the DunGen crypto market interface. Our approach leveraged various AI models to solve specific challenges throughout the development process.

## 1. Smart Contract Generation

### Prompt Title: Rootstock Token Swap Contract

**Prompt Text:**
```
Create a Solidity smart contract for a token swap platform on Rootstock blockchain. The contract should:
1. Allow users to swap 
  | "RBTC"
  | "DOC"
  | "RIF"
  | "SOV"
  | "BPRO"
  | "RUSDT"  among each other.
2. Have a function that takes RUSDT amount, destination token address, and user wallet
3. Include necessary safety checks and error handling
4. Be gas-efficient
5. Follow best practices for Solidity 0.8.x
```

**Expected Output:** A fully functional and secure Solidity contract for token swapping on Rootstock.

**AI Model Used:** Claude 3.7 sonnet 

**Use Case:** Generated the foundational spaceStationRootstock.sol contract that powers the token swap functionality.

**Best Practices / Insights:**
- Including specific version requirements in the prompt improved code quality
- Requesting gas optimization explicitly resulted in more efficient contract design
- Adding "safety checks" to the prompt ensured proper error handling was implemented

**Example Output:** 
The generated contract included a robust `swap` function with appropriate error handling and security checks. The AI created contract interfaces for both the Swap Router and ERC20 tokens, demonstrating understanding of the Rootstock ecosystem.

## 2. Voice-Controlled Agent Development

### Prompt Title: Natural Language Token Operations Agent

**Prompt Text:**
```
Design a system that can interpret natural language requests for cryptocurrency operations and convert them to function calls for a token swap API. The system should:

1. Recognize intent for operations like "swap", "check balance", and "transfer"
2. Extract relevant parameters like token names, amounts, and wallet addresses
3. Handle ambiguity in user requests
4. Generate appropriate API calls to execute the requested operations
5. Provide conversational responses that confirm the action

Focus specifically on the Rootstock blockchain and these tokens: RBTC, DOC, RIF, SOV, BPRO, and RUSDT
```

**Expected Output:** A systematic approach to natural language processing for crypto operations with specific code examples.

**AI Model Used:** GPT-4o

**Use Case:** Implemented in the backend agent to process voice commands and execute appropriate blockchain transactions.

**Best Practices / Insights:**
- Specifying the exact token list dramatically improved recognition accuracy
- Requesting conversational responses led to more user-friendly interactions
- Asking for ambiguity handling resulted in more robust input processing

**Example Output:**
The AI generated a comprehensive system that could correctly identify when a user said "swap 10 RUSDT to RIF" and translate that into the correct function call with parameters, while also providing natural language confirmation.

## 3. Interactive UI Component Design

### Prompt Title: Themed Crypto Market Stall Components

**Prompt Text:**
```
Create a React component for a "stall" in a virtual marketplace with these requirements:
1. Two visual themes: "space" and "cave" that can be toggled
2. Animated elements that respond to user interaction
3. Clear visual indicators when the stall is "active" (user is nearby)
4. Display for token name, price, and description
5. Support for different stall types (swap, balance, transfer)
6. Use Tailwind CSS for styling
7. Include accessibility considerations
```

**Expected Output:** React component code for visually appealing and functional marketplace stalls.

**AI Model Used:** Claude 3.7 Sonnet

**Use Case:** Used to create the specialized stall components in the frontend/src/app/arena/components/stalls directory.

**Best Practices / Insights:**
- Including the requirement for animations resulted in more engaging UI
- Specifying multiple themes encouraged modular component design
- Requesting accessibility considerations improved the overall UX quality

**Example Output:**
The AI generated specialized components like `HologramStall.tsx`, `PortalStall.tsx`, and others with theme-specific styling, animations, and interactive elements that provided a cohesive and engaging interface.

## 4. Plugin Architecture for Token Operations

### Prompt Title: Modular Token Operation Plugin System

**Prompt Text:**
```
Design a plugin architecture for a crypto agent that can:
1. Support operations for token swapping on Rootstock
2. Check token balances
3. Transfer tokens between addresses
4. Be easily extensible for future operations
5. Handle errors gracefully
6. Log operations for debugging
7. Use the Viem library for blockchain interactions

Include the main plugin class and at least three tool implementations.
```

**Expected Output:** TypeScript code for a plugin system that can be used to extend the agent's capabilities.

**AI Model Used:** Claude 3.7 Sonnet

**Use Case:** Implemented in the agent/src/plugins/token-swap directory to provide modular functionality.

**Best Practices / Insights:**
- Specifying the library (Viem) resulted in immediately usable code
- Requesting extensibility led to a more future-proof design
- Asking for error handling improved the robustness of the system

**Example Output:**
The AI created a complete plugin architecture with a base class and implementations for swap_tokens, check_token_balance, and transfer_token operations, with appropriate error handling and logging.


## Summary of AI Impact

Throughout the project, AI tools were instrumental in rapidly developing complex components that would have otherwise required significant specialized knowledge and development time. By carefully crafting prompts with specific requirements, we were able to generate high-quality code that could be integrated with minimal modification.

The most significant impact came from the AI's ability to understand the Rootstock blockchain ecosystem and generate appropriate code for token operations, which shortened development time from weeks to days. Additionally, the AI's assistance in creating visually engaging UI components allowed us to focus on core functionality while still delivering a polished user experience.

Our prompt engineering evolved throughout the project, with later prompts becoming more specific and including explicit requirements for error handling, optimization, and extensibility, which resulted in higher quality outputs that required less manual modification.