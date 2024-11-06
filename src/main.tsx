import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from "./App.tsx";
import ReactQueryProvider from "./providers/ReactQueryProvider.tsx";
import ContextProvider from "./providers/ContextProvider.tsx";
import SUIWalletProvider from "./providers/SUIWalletProvider.tsx";

import { Footer } from "./components/Footer.tsx";
import { Header } from "./components/Header.tsx";

import "./index.css";

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <App />,
//   },
// ]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ReactQueryProvider>
      <ContextProvider>
        <SUIWalletProvider>
          <Header />
          <App />
          <Footer />
        </SUIWalletProvider>

        {/* <Header />
        <App />
        <Footer /> */}
      </ContextProvider>
    </ReactQueryProvider>
  </StrictMode>,
);
