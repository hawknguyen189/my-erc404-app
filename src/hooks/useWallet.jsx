import { useAccount, useConnect, useDisconnect } from "wagmi";
// import { injected } from "wagmi/connectors";

export const useWallet = () => {
  const { address, isConnected } = useAccount();
  const {
    connectAsync,
    connectors,
    error: connectError,
    status,
  } = useConnect();
  const { disconnectAsync } = useDisconnect();

  // Log connector and connection status
  console.log("Available connectors:", connectors);
  console.log("Connection status:", status);
  if (connectError) {
    console.error("Connection error:", connectError.message);
  }

  return {
    address,
    isConnected,
    connect: async () => {
      console.log("Attempting to connect with Rabby Wallet...");
      if (!window.ethereum) {
        console.error(
          "No Ethereum provider detected. Ensure Rabby Wallet is installed."
        );
        alert("Please install Rabby Wallet to connect.");
        return;
      }
      if (window.ethereum.isRabby) {
        console.log("Rabby Wallet detected.");
      } else {
        console.warn(
          "Rabby Wallet not detected. Found provider:",
          window.ethereum
        );
      }
      const rabbyConnector = connectors.find((c) => c.id === "rabby");
      if (!rabbyConnector) {
        console.error("Rabby connector not found in connectors:", connectors);
        alert("Rabby Wallet connector not available.");
        return;
      }
      try {
        await connectAsync({ connector: rabbyConnector });
        console.log("Connected successfully.");
      } catch (err) {
        console.error("Connection failed:", err.message);
        if (err.message.includes("Connector already connected")) {
          // Attempt to reset and reconnect
          console.log("Resetting connector state...");
          await disconnectAsync();
          await connectAsync({ connector: rabbyConnector });
        }
      }
    },
    disconnect: async () => {
      console.log("Disconnecting Rabby Wallet...");
      try {
        await disconnectAsync();
        console.log("Disconnected successfully.");
      } catch (err) {
        console.error("Disconnection failed:", err.message);
      }
    },
    connectError,
  };
};
