import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AsteroidProvider } from "./context/AsteroidContext.jsx";
import { WagmiProvider } from "wagmi";
import { BrowserRouter } from "react-router-dom";
import { AppProvider } from "./context/AppContext.jsx"; // Unchanged, still imports AppProvider
import { config } from "./config/config.js";
import App from "./App.jsx";
import "./index.css";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <AppProvider>
          <AsteroidProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </AsteroidProvider>
        </AppProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
);
