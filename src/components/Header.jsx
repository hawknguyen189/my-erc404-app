import React, { useContext } from "react";
import { AppContext } from "../contexts/AppContext";
import WalletConnectButton from "./WalletConnectButton";

// Rest unchanged...

const Header = () => {
  const { walletAddress } = useContext(AppContext);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <a className="navbar-brand" href="/">
          ERC-404 dApp
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              {walletAddress && (
                <span className="nav-link">
                  Wallet: {walletAddress.slice(0, 6)}...
                  {walletAddress.slice(-4)}
                </span>
              )}
            </li>
            <li className="nav-item">
              <WalletConnectButton />
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
