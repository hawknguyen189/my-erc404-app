import { DEFAULT_CHAIN_ID } from "./networks";

// eslint-disable-next-line no-unused-vars
export const getContracts = (chainId = DEFAULT_CHAIN_ID) => ({
  tokenAddress: "0x1234567890abcdef1234567890abcdef12345678", // Update per chain if needed
  stakingAddress: "0xabcdef1234567890abcdef1234567890abcdef12",
});
