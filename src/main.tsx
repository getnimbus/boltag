import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import ReactQueryProvider from "./contexts/ReactQueryProvider.tsx";
import SuiInstanceProvider from "./contexts/SuiInstanceProvider.tsx";

import App from "./App.tsx";

import "./index.css";
import "@suiet/wallet-kit/style.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ReactQueryProvider>
      <SuiInstanceProvider>
        <App />
      </SuiInstanceProvider>
    </ReactQueryProvider>
  </StrictMode>,
);
