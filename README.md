### **PromptForge: An AI-Powered Full-Stack NFT Minter**

### **Project Overview**

PromptForge is a comprehensive Web3 full-stack application that allows users to generate unique images from text prompts using an AI model and mint them as on-chain ERC-721 NFTs. It also serves as a public gallery and a personal studio for artists to view and manage their creations.

This project showcases an advanced full-stack architecture, demonstrating proficiency in AI integration, decentralized storage, secure blockchain interactions, and a modern, user-friendly frontend.

**Watch a Demo Video:** [https://youtu.be/BPlr2dJIbCU]

---

### **Core Features**

- **AI Image Generation**: The backend service utilizes the open-source **Stable Diffusion** model from Hugging Face to generate images in real-time based on user prompts.
- **Decentralized Storage**: Both the generated images and the NFT metadata are uploaded to **IPFS** via **Pinata**, ensuring the content is decentralized and permanently available.
- **ERC-721 Smart Contract**: A custom contract deployed on the Sepolia test network securely handles the minting of NFTs.
- **Secure Transaction Signing**: The application uses **cryptographic signatures** to authenticate the user's wallet address and transaction hash, preventing fraudulent minting records.
- **Database Integration**: A **PostgreSQL** database is used to securely store minting records, including the user's address, prompt, and transaction hash, demonstrating robust backend data management.
- **Full-Stack Architecture**:
    - **Frontend**: Built with **React**, **Mantine**, **Tailwind**, and **TanStack Router/Query**, providing a multi-page, intuitive user interface for wallet connection, API interaction, and smart contract calls.
    - **Backend**: Built with **FastAPI (Python)**, serving as an efficient and high-performance bridge between the frontend, the AI model, and the IPFS service.

---

### **Technology Stack**

#### **Frontend (`./frontend`)**
- **React**: A popular JavaScript library for building user interfaces.
- **Mantine**: A robust component library for rapid UI development.
- **TanStack Router**: A modern, type-safe router for seamless navigation.
- **TanStack Query**: Manages server-state and API requests efficiently.
- **Wagmi & Viem**: A powerful collection of React Hooks for Ethereum and Web3.
- **TypeScript**: Enhances code quality and maintainability with static typing.

#### **Backend (`./backend`)**
- **Python**: The main programming language.
- **FastAPI**: A high-performance web framework for building APIs.
- **Hugging Face Diffusers**: The library used to load and run the AI model.
- **Hugging Face `segmind/tiny-sd`**: A lightweight AI image generation model, optimized for memory usage.
- **SQLAlchemy & PostgreSQL**: For secure and reliable database operations.
- **`eth-account`**: Used for cryptographic signature verification.

#### **Smart Contract (`./smart-contract`)**
- **Solidity**: The contract-oriented programming language for writing smart contracts.
- **Hardhat**: The development environment for compiling, testing, and deploying smart contracts.
- **OpenZeppelin Contracts**: Industry-standard library for secure and reusable smart contracts.
- **Sepolia Test Network**: A test environment that mirrors the Ethereum Mainnet.

---

### **Project Features and Design**

- **Multi-Page Interface**: The application is structured into three main pages to provide a clear user experience:
    - **Gallery**: A public space showcasing all NFTs minted on the platform. Accessible without a wallet connection.
    - **Studio**: A private gallery for the connected user, displaying only their minted NFTs.
    - **Forge**: A dedicated page for AI image generation and NFT minting.
- **Secure Backend API**: The backend is protected by a **CORS middleware** and enforces **wallet signature validation** to prevent unauthorized access and data manipulation.
- **Modular and Scalable Architecture**: The separation of frontend, backend, and smart contract layers ensures the project is easy to maintain and scale.

---

### **How to Run the Project Locally**

Please ensure you have Docker, Node.js, and Python 3.11+ installed.

#### **0. Prerequisites**
1.  Register and obtain a valid web3 RPC Node URL to deploy smart contracts on the hardhat. You can choose any provider you like, such as [*Alchemy*](https://www.alchemy.com/), [*QuckNode*](https://www.quicknode.com/), [*Infura*](https://www.infura.io/), etc.
2.  Register and obtain your [*PINATA*](https://pinata.cloud/) API Key and API Secret.
3.  Install [uv](https://docs.astral.sh/uv/getting-started/installation/) on your computer for Python package management.
4.  **[Optional]** Register and obtain a WalletConnect Project ID from [*Reown*](https://cloud.reown.com/) if you wish to use WalletConnect.

#### **1. Smart Contract Setup**

> **_NOTE:_** You can completely skip this part if you want to use the pre-deployed contract directly.

1.  Navigate to the `smart-contract` folder.
2.  Install dependencies: `npm install`
3.  Configure your `SEPOLIA_RPC_URL` (the web3 RPC Node URL) and `SEPOLIA_PRIVATE_KEY` (the private key of the wallet account you want to use to deploy contracts) using `hardhat-keystore`:

```shell
npx hardhat keystore set SEPOLIA_RPC_URL
npx hardhat keystore set SEPOLIA_PRIVATE_KEY
```

4.  Build the contract: `npx hardhat compile`
5.  Deploy the contract:

```shell
npx hardhat ignition deploy --network sepolia ignition/modules/PromptForgedNFT.ts
```

6.  Copy the deployed contract address and ABI (`smart-contract/artifacts/contracts/PromptForgeNFT.sol/PromptForgeNFT.json`) to replace `NFT_CONTRACT_ADDRESS` and `NFT_CONTRACT_ABI` in `frontend/src/utils/abi.ts`.

#### **2. Backend Service Setup**
1.  Start the PostgreSQL: `docker compose up db -d`
2.  Configure your `.env` file with your `PINATA_API_KEY` (API Key), and `PINATA_SECRET_API_KEY` (API Secret).
3.  Navigate to the `backend` folder.
4.  Install dependencies: `uv sync`
5.  Intialize the PostgreSQL: `uv run poe db-init`
6.  Run the service: `uv run poe start`

#### **3. Frontend Setup**
1.  Navigate to the `frontend` folder.
2.  Install dependencies: `npm install`
3.  **[Optional]** In `.env`, enter your **WalletConnect Project ID** for `VITE_WALLETCONNECT_PROJECT_ID`.
4.  Run the development server: `npm run dev`

---

### **Development and Deployment**

Actually, this project is cloned and revised from [Full Stack FastAPI Template](https://github.com/fastapi/full-stack-fastapi-template). Everything described in [development.md](development.md) and [deployment.md](demployment.md) is still valid and workable.

---

### **Contact Information**

- **Author**: [Kenny Cheng](https://www.linkedin.com/in/kenny-cheng-924032118/)
- **GitHub**: [https://github.com/prompt-forge-dev]

---
