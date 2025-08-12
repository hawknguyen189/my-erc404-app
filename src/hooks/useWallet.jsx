import { useEffect, useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { createPublicClient, http } from "viem";
import { networks, DEFAULT_CHAIN_ID } from "../config/networks";
import { injected } from "wagmi/connectors";

export const useWallet = () => {
  const { address, isConnected, chainId } = useAccount();
  const { connect, connectors, pendingConnector } = useConnect();
  const { disconnect } = useDisconnect();
  const [connectionError, setConnectionError] = useState(null);
  const [hasAttemptedAutoConnect, setHasAttemptedAutoConnect] = useState(false);

  const provider = createPublicClient({
    chain: networks[DEFAULT_CHAIN_ID],
    transport: http(networks[DEFAULT_CHAIN_ID].rpcUrls.default.http[0]),
  });

  // Check for authorized accounts
  const getAuthorizedAccounts = async () => {
    if (!window.ethereum) return [];
    try {
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      console.log("Authorized accounts:", accounts);
      return accounts || [];
    } catch (error) {
      console.error("Error fetching authorized accounts:", error);
      return [];
    }
  };

  // Auto-connect on mount with delay
  useEffect(() => {
    const tryAutoConnect = async () => {
      // Wait for initial state sync
      await new Promise((resolve) => setTimeout(resolve, 500)); // Increased delay for state sync
      const accounts = await getAuthorizedAccounts();

      if (
        hasAttemptedAutoConnect ||
        localStorage.getItem("walletDisconnected") === "true"
      ) {
        console.log("Skipping auto-connect:", {
          hasAttemptedAutoConnect,
          isDisconnected: localStorage.getItem("walletDisconnected"),
          accounts,
        });
        return;
      }
      if (isConnected && address) {
        console.log("Auto-connect skipped: Already connected", {
          address,
          chainId,
          accounts,
        });
        setHasAttemptedAutoConnect(true);
        return;
      }
      if (accounts.length > 0) {
        console.log("Attempting auto-connect with authorized account:", {
          accounts,
        });
        try {
          const injectedConnector = injected();
          await connect({ connector: injectedConnector });
          console.log("Auto-connect successful:", address);
          setConnectionError(null);
          localStorage.removeItem("walletDisconnected");
        } catch (error) {
          console.error("Auto-connect failed:", error);
        } finally {
          setHasAttemptedAutoConnect(true);
        }
        return;
      }

      console.log("No authorized accounts, skipping auto-connect:", {
        accounts,
      });
      setHasAttemptedAutoConnect(true);
    };
    tryAutoConnect();
  }, [connect, isConnected, address, chainId]);

  // Log wallet state
  useEffect(() => {
    const logState = async () => {
      const accounts = await getAuthorizedAccounts();
      console.log("Wallet state:", {
        isConnected,
        address,
        chainId,
        selectedAddress: window.ethereum?.selectedAddress,
        authorizedAccounts: accounts,
        isRabby: window.ethereum?.isRabby,
        pendingConnector: pendingConnector?.id,
        connectors: connectors.map((c) => ({
          id: c.id,
          name: c.name,
          ready: c.ready,
        })),
      });
    };
    logState();
  }, [isConnected, address, chainId, connectors, pendingConnector]);

  const connectWallet = async () => {
    console.log("Attempting manual wallet connection...", {
      isConnected,
      address,
    });
    try {
      if (!window.ethereum) {
        const errorMsg =
          "No wallet detected. Please install Rabby or another Ethereum wallet.";
        console.error(errorMsg);
        setConnectionError(errorMsg);
        alert(errorMsg);
        return;
      }
      const accounts = await getAuthorizedAccounts();
      if (isConnected && address && !pendingConnector) {
        console.log("Already connected, skipping connect:", {
          address,
          authorizedAccounts: accounts,
        });
        return;
      }
      if (accounts.length > 0 && !pendingConnector) {
        console.log("Wallet already authorized, attempting silent connect:", {
          accounts,
        });
        await new Promise((resolve) => setTimeout(resolve, 200)); // Sync delay
        const injectedConnector = injected();
        await connect({ connector: injectedConnector });
        console.log("Silent connect successful:", address);
        localStorage.removeItem("walletDisconnected");
        setConnectionError(null);
        return;
      }

      if (!window.ethereum.isRabby) {
        console.warn(
          "Non-Rabby wallet detected. Expected Rabby, but proceeding."
        );
        setConnectionError(
          "Using non-Rabby wallet. Ensure Rabby is installed."
        );
      }

      console.log("Requesting wallet connection...", { pendingConnector });
      const injectedConnector = injected();
      await connect({ connector: injectedConnector });
      console.log("Wallet connection successful:", address);
      localStorage.removeItem("walletDisconnected");
      setConnectionError(null);
    } catch (error) {
      console.error("Connection failed:", error);
      setConnectionError(error.message || "Failed to connect wallet");
      alert(error.message || "Failed to connect wallet");
    }
  };

  const disconnectWallet = async () => {
    console.log("Disconnecting wallet...", { isConnected, address });
    try {
      await disconnect();
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Ensure state clears
      setConnectionError(null);
      localStorage.setItem("walletDisconnected", "true");
      console.log("Wallet disconnected successfully");
    } catch (error) {
      console.error("Disconnection failed:", error);
      setConnectionError(error.message || "Failed to disconnect wallet");
    }
  };

  useEffect(() => {
    if (isConnected && address && chainId !== DEFAULT_CHAIN_ID) {
      const errorMsg = `Please switch to ${networks[DEFAULT_CHAIN_ID].name} (Chain ID: ${DEFAULT_CHAIN_ID}).`;
      console.error(errorMsg);
      setConnectionError(errorMsg);
      alert(errorMsg);
      disconnect();
    }
  }, [isConnected, address, chainId, disconnect]);

  return {
    address,
    provider,
    signer: null,
    chainId: chainId || DEFAULT_CHAIN_ID,
    connectWallet,
    disconnectWallet,
    connectionError,
  };
};
