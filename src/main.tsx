import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import ReactQueryProvider from "./providers/ReactQueryProvider.tsx";
import SuiInstanceProvider from "./providers/SuiInstanceProvider.tsx";
import ContextProvider from "./providers/ContextProvider.tsx";

import App from "./App.tsx";

import "./index.css";
import "@suiet/wallet-kit/style.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ReactQueryProvider>
      <SuiInstanceProvider>
        <ContextProvider>
          <App />
        </ContextProvider>
      </SuiInstanceProvider>
    </ReactQueryProvider>
  </StrictMode>,
);
