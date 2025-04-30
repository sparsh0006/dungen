# DunGen - AI-Powered Crypto Market Interface

## Project Overview
DunGen is an interactive crypto market interface built on Rootstock blockchain that leverages AI to enhance user experience through natural language interactions. The project combines a visually engaging game-like interface with powerful crypto trading and management capabilities.

## Key Features
- **Voice-Controlled AI Assistant**: Interact with crypto markets using natural language
- **Token Swapping**: Easily swap tokens on Rootstock blockchain
- **Balance Checking**: Check token balances across different addresses
- **Token Transfers**: Transfer tokens between wallets
- **Interactive UI**: Game-like interface with themed environments

## Tech Stack
- **Frontend**: Next.js, Tailwind CSS, React
- **Backend**: Express.js, Socket.io
- **AI Integration**: Claude, GPT ,Gemini models
- **Blockchain**: Rootstock smart contracts, Viem, Wagmi
- **Authentication**: Privy Auth

## AI Usage in Development
This project extensively leveraged AI throughout its development process:

1. **Smart Contract Generation**: Used AI to create and optimize Solidity smart contracts for token swapping on Rootstock.
2. **Component Design**: Used AI to generate specialized UI components for the game-like interface.
3. **Integration Logic**: Leveraged AI to help with complex backend integration between the AI assistant and blockchain functions.
4. **Conversational Agent**: Implemented a voice-controlled AI assistant that interprets natural language requests and performs crypto operations.

## Project Structure
```
├── agent/             # Backend server and AI integration
    ├── plugins/       # Custom plugins including token-swap for Rootstock
    ├── routes/        # API routes for agent functionality
    └── server.ts      # Main server setup
├── contract/          # Smart contracts for Rootstock blockchain
    ├── constants.ts   # Contract addresses and ABIs
    ├── spaceStationRootstock.sol  # Main swap contract
    └── yrbtc.sol      # RBTC yield token contract
└── frontend/          # Next.js frontend application
    ├── components/    # Shared React components
    ├── contexts/      # React context providers
    ├── src/app/       # Application pages and modules
        └── arena/     # Main interactive interface
```

## How It Works
1. Users connect their wallet using Privy Auth
2. They enter the interactive "Space" interface
3. By approaching different "Space-Station" in the interface, they can interact with different crypto functions
4. Using voice commands (pressing Space), users can speak natural language requests like "Swap 5 RUSDT to RBTC"
5. The AI agent processes these requests and executes the appropriate blockchain transactions
6. Real-time feedback is provided through both visual and audio responses

## AI Prompts Usage
The project's most innovative aspect is the use of AI to create a natural language interface for crypto operations. Detailed information about our AI prompt engineering can be found in the `AI_PROMPTS.md` file.

## Installation and Setup

### Prerequisites
- Node.js 16+
- PNPM package manager
- Rootstock wallet with testnet tokens

### Local Development
1. Clone the repository
```bash
git clone https://github.com/sparsh0006/dungen.git
cd dungen
```

2. Install dependencies
```bash
# Install frontend dependencies
cd frontend
pnpm install

# Install agent dependencies
cd ../agent
pnpm install
```

3. Create environment files
```bash
# In the agent directory create a .env with given variables
cp .env.example .env
```
4. Set environment variables
```bash
# Fill in your AI API keys and wallet private key
WALLET_PRIVATE_KEY=YOUR_PRIVATE_KEY (add 0x in the starting of the key)
RPC_PROVIDER_URL=https://mycrypto.rsk.co
COINGECKO_API_KEY=YOUR_COINGECKO_API_KEY
GOOGLE_API_KEY=YOUR_GOOGLE_GEMINI_API_KEY   
OPENAI_API_KEY=YOUR_OPENAI_API_KEY
```

5. Start the development servers
```bash
# Start agent server
cd agent
pnpm run dev

# Start frontend server in a new terminal
cd frontend
pnpm run dev
```

6. Open your browser at http://localhost:3001

## Contributions
This project was developed during the (A)I Buidl Lab hackathon.

## License
ISC License
