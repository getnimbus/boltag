import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import SuiInstanceProvider from "./contexts/SuiInstanceProvider.tsx";
import ThemeProvider from "./contexts/ThemeProvider.tsx";

import App from "./App.tsx";

import { SuiClientProvider, WalletProvider } from "@mysten/dapp-kit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { networkConfig } from "./networkConfig.ts";

import "@mysten/dapp-kit/dist/index.css";
import "@radix-ui/themes/styles.css";

import "./index.css";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig} defaultNetwork="mainnet">
        <WalletProvider
          autoConnect={true}
          slushWallet={{
            name: "Nimbus",
          }}
        >
          <SuiInstanceProvider>
            <ThemeProvider>
              <App />
            </ThemeProvider>
          </SuiInstanceProvider>
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  </StrictMode>,
);
