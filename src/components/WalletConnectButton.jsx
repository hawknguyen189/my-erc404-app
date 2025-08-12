import { useWallet } from "../hooks/useWallet";

const WalletConnectButton = () => {
  const { isConnected, connect, disconnect, address, connectError } =
    useWallet();

  console.log("WalletConnectButton rendered, isConnected:", isConnected);

  return (
    <div className="text-center">
      {isConnected ? (
        <button
          className="btn btn-danger"
          onClick={disconnect}
          data-bs-toggle="tooltip"
          data-bs-placement="top"
          title="Disconnect your wallet"
        >
          Disconnect {address?.slice(0, 6)}...{address?.slice(-4)}
        </button>
      ) : (
        <button
          className="btn btn-primary"
          onClick={connect}
          data-bs-toggle="tooltip"
          data-bs-placement="top"
          title="Connect with Rabby Wallet"
        >
          Connect Rabby Wallet
        </button>
      )}
      {connectError && (
        <p className="text-danger mt-3">
          Error: {connectError.message}
          {connectError.message.includes("Connector already connected") &&
            " (Try refreshing the page if reconnect fails)"}
        </p>
      )}
    </div>
  );
};

export default WalletConnectButton;
