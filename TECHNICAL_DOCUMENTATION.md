# DunGen - Technical Documentation

## System Architecture

DunGen is built on a modern, modular architecture that combines frontend, backend(agent), and blockchain components:

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│                 │     │                  │     │                 │
│  Next.js        │◄────►  Express Agent   │◄────►  Rootstock      │
│  Frontend       │     │  Backend         │     │  Blockchain     │
│                 │     │                  │     │                 │
└─────────────────┘     └──────────────────┘     └─────────────────┘
       │                        │                        │
       │                        │                        │
       ▼                        ▼                        ▼
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Privy Auth     │     │  AI Models       │     │  Smart          │
│  User Auth      │     │  (GPT/Gemini)    │     │  Contracts      │
│                 │     │                  │     │                 │
└─────────────────┘     └──────────────────┘     └─────────────────┘
```

### Frontend (Next.js)

The frontend is built using Next.js with the App Router, providing a modern React framework with built-in optimizations. Key components include:

1. **Arena Interface**: A game-like environment where users can navigate between different "stalls" that represent crypto operations.

2. **Voice Recognition**: Built-in speech recognition that captures user voice commands and sends them to the agent backend.

3. **Real-time Updates**: Socket.io integration for multiplayer functionality and real-time updates.

4. **Wallet Integration**: Privy Auth for seamless wallet connection and authentication.

### Backend Agent (Express)

The backend agent serves as the bridge between user intent and blockchain operations:

1. **Natural Language Processing**: Processes user queries using AI models to extract intent and parameters.

2. **Custom Plugins**: Modular plugins for different token operations (swap, balance, transfer).

3. **Tool System**: A tool-based architecture that allows the AI to execute specific functions based on user intent.

4. **Fallback System**: Can switch between different AI models (GPT and Gemini) for optimal performance.

### Blockchain Integration

DunGen interacts with the Rootstock blockchain through:

1. **Smart Contracts**: Custom contracts for token swapping and other operations.

2. **Viem Library**: Modern TypeScript library for Ethereum-compatible blockchain interaction.

3. **GOAT SDK**: Toolkit for building AI-powered blockchain agents.

## Technical Implementation Details

### Natural Language Processing Pipeline

The NLP pipeline follows these steps:

1. **Voice Capture**: Frontend captures user voice input using the browser's SpeechRecognition API.

2. **Text Processing**: The text is sent to the backend agent for processing.

3. **Intent Extraction**: AI model identifies the operation type and extracts parameters.

4. **Validation**: Parameters are validated for correctness and completeness.

5. **Tool Execution**: Appropriate blockchain operation is executed using the extracted parameters.

6. **Response Generation**: AI generates a natural language response based on the operation result.

7. **Text-to-Speech**: Response is converted to speech using ElevenLabs API (when available).

### Token Swap Implementation

The token swap functionality is implemented through:

1. **Rootstock Contract**: Custom smart contract (taifeiBazaarRootstock.sol) that interfaces with Rootstock's swap router.

2. **Token Registry**: Predefined list of supported tokens with their addresses.

3. **Gas Estimation**: Automatic gas estimation for efficient transactions.

4. **Error Handling**: Comprehensive error handling for common swap issues.

Code example of the swap function:

```solidity
function swap(uint256 usdcAmount, address _tokenOut, address _userWallet) external returns (uint256 wethAmount) {
    // Transfer RUSDT from user to this contract
    IERC20(RUSDT).transferFrom(_userWallet, address(this), usdcAmount);
    
    // Approve the router to spend RUSDT
    IERC20(RUSDT).approve(SWAP_ROUTER, usdcAmount);
    
    // Set up the params for the swap
    ISwapRouter.ExactInputSingleParams memory params = ISwapRouter.ExactInputSingleParams({
        tokenIn: RUSDT,
        tokenOut: _tokenOut,
        fee: POOL_FEE,
        recipient: _userWallet, 
        amountIn: usdcAmount,
        amountOutMinimum: 0,
        sqrtPriceLimitX96: 0 
    });
    
    // Execute the swap
    wethAmount = ISwapRouter(SWAP_ROUTER).exactInputSingle(params);
    
    emit SwapExecuted(usdcAmount, wethAmount);
    return wethAmount;
}
```

### Multiplayer Implementation

The multiplayer functionality is implemented using:

1. **Socket.io**: Real-time bidirectional communication between clients and server.

2. **Room System**: Users can create or join rooms using unique 5-character codes.

3. **State Synchronization**: Player positions, names, and emotes are synchronized in real-time.

4. **Reconnection Handling**: Automatic reconnection with state persistence.

## Security Considerations

DunGen implements several security measures:

1. **Client-Side Security**:
   - HTTPS enforcement
   - Content Security Policy
   - Input validation

2. **Server-Side Security**:
   - Rate limiting
   - Input sanitization
   - Error handling without information leakage

3. **Blockchain Security**:
   - Transaction signing on client-side only
   - Private key protection
   - Gas limit management
   - Slippage protection

## Performance Optimizations

Several optimizations have been implemented:

1. **Frontend**:
   - Code splitting and lazy loading
   - Static generation where possible
   - Optimized assets and minimal dependencies

2. **Backend**:
   - Caching for frequent queries
   - Connection pooling
   - Rate limiting and request throttling

3. **Blockchain**:
   - Batch transactions when possible
   - Gas optimization in smart contracts
   - Minimal on-chain storage

## Deployment Architecture

DunGen is deployed using a modern cloud-based architecture:

1. **Frontend**: Vercel for Next.js hosting with edge functions.
2. **Backend**: Containerized Express app deployed on cloud platform.
3. **Sockets**: Dedicated Socket.io server with horizontal scaling.
4. **Contracts**: Deployed on Rootstock testnet and mainnet.

## Development Setup and Extension

### Prerequisites

- Node.js 16+
- PNPM package manager
- Rootstock wallet with testnet tokens
- API keys for OpenAI, Google AI, and ElevenLabs (optional)

### Environment Variables

The following environment variables are required:

```
# Backend
OPENAI_API_KEY=your_openai_key
GOOGLE_API_KEY=your_google_key
WALLET_PRIVATE_KEY=your_private_key
RPC_PROVIDER_URL=https://mycrypto.rsk.co

# Frontend
NEXT_PUBLIC_ELEVENLABS_API_KEY=your_elevenlabs_key
```

### Adding New Token Operations

To add new token operations:

1. Create a new tool in the token-swap plugin
2. Update the token registry if new tokens are supported
3. Modify the AI prompt to include the new operation type and parameter extraction
4. Add UI components for the new operation if needed

### Extending the UI

The themed environment can be extended by:

1. Creating new stall components in the `stalls` directory
2. Adding new themes to the Background component
3. Implementing additional interactive elements

## Known Limitations and Future Work

Current limitations include:

1. **Speech Recognition**: Browser-based speech recognition has varying reliability across browsers.

2. **AI Model Latency**: Response times can vary based on AI model availability and server load.

3. **Token Support**: Currently limited to predefined tokens on Rootstock.

Future work planned:

1. **Multi-chain Support**: Extend to other EVM-compatible chains.

2. **Advanced Voice Features**: Implement more complex voice interactions including follow-up questions.

3. **Custom Visual Avatars**: Allow users to customize their in-game representation.

4. **DeFi Integration**: Add support for additional DeFi operations like staking and lending.

5. **Mobile Experience**: Optimize the interface for mobile devices with touch controls.