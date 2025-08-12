import { defineChain } from "viem";

export const networks = {
  1: defineChain({
    id: 1,
    name: "Ethereum Mainnet",
    rpcUrls: {
      default: {
        http: [import.meta.env.VITE_RPC_URL || "https://rpc.ankr.com/eth"],
      },
    },
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    blockExplorers: {
      default: { name: "Etherscan", url: "https://etherscan.io" },
    },
  }),
};

export const DEFAULT_CHAIN_ID = 1;
