import React, { useContext, useEffect } from "react";
import { AppContext, AppProvider } from "./contexts/AppContext";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import PlanetView from "./pages/PlanetView";
import Marketplace from "./pages/Marketplace";
import FleetManager from "./pages/FleetManager";
import AsteroidMap from "./pages/AsteroidMap";
import Footer from "./components/Footer";
import { WagmiProvider, createConfig } from "wagmi";
import { networks, DEFAULT_CHAIN_ID } from "./config/networks";
import { injected } from "wagmi/connectors";
import { http } from "viem";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const config = createConfig({
  chains: [networks[DEFAULT_CHAIN_ID]],
  connectors: [injected()],
  transports: {
    [DEFAULT_CHAIN_ID]: http(
      networks[DEFAULT_CHAIN_ID].rpcUrls.default.http[0]
    ),
  },
  autoConnect: true,
});

function InnerApp() {
  const { walletAddress, connectionError } = useContext(AppContext);

  useEffect(() => {
    console.log(
      "InnerApp rendered, walletAddress:",
      walletAddress,
      "connectionError:",
      connectionError
    );
  }, [walletAddress, connectionError]);

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <main
        className="container my-4 flex-grow-1"
        key={walletAddress || "disconnected"}
      >
        {connectionError ? (
          <div className="text-center text-danger">
            <h5>Error: {connectionError}</h5>
          </div>
        ) : walletAddress ? (
          <>
            <AsteroidMap />
            <hr />
            <Dashboard />
            <hr />
            <PlanetView />
            <hr />
            <Marketplace />
            <hr />
            <FleetManager />
          </>
        ) : (
          <div className="text-center">
            <h5>Please connect your Rabby wallet to continue.</h5>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <AppProvider>
          <InnerApp />
        </AppProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
