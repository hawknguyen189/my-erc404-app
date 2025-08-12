import { http, createConfig } from "wagmi";
import { mainnet } from "wagmi/chains";
import { injected } from "wagmi/connectors";

export const config = createConfig({
  chains: [mainnet],
  connectors: [
    injected({
      target: () => ({
        id: "rabby",
        name: "Rabby Wallet",
        provider: window.ethereum?.isRabby ? window.ethereum : undefined,
      }),
      shimDisconnect: true,
    }),
  ],
  transports: {
    [mainnet.id]: http(),
  },
});
