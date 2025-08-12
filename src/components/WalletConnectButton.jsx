import React from "react";
import { useWallet } from "../hooks/useWallet";

const WalletConnectButton = () => {
  const { address, connectWallet, disconnectWallet, connectionError } =
    useWallet();

  return (
    <div>
      <button
        className="btn btn-primary"
        onClick={address ? disconnectWallet : connectWallet}
        disabled={connectionError && !address} // Disable if error persists
      >
        {address ? "Disconnect" : "Connect Rabby Wallet"}
      </button>
      {connectionError && (
        <span className="text-danger ms-2">{connectionError}</span>
      )}
    </div>
  );
};

export default WalletConnectButton;
