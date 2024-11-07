import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "sonner";
// import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from "./App.tsx";
import ReactQueryProvider from "./providers/ReactQueryProvider.tsx";
import ContextProvider from "./providers/ContextProvider.tsx";
// import SUIWalletProvider from "./providers/SUIWalletProvider.tsx";

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
        <Toaster
          expand={true}
          position="top-center"
          theme="light"
          toastOptions={{
            unstyled: false,
            classNames: {
              error: "text-red-400 border-red-400",
              success: "text-green-400 border-green-400",
              warning: "text-yellow-400 border-yellow-400",
              info: "text-blue-400 border-blue-400",
              default: "text-white border-[#BCFD4F]",
            },
          }}
        />

        {/* <SUIWalletProvider>
          <Header />
          <App />
          <Footer />
        </SUIWalletProvider> */}
        <Header />
        <App />
        <Footer />
      </ContextProvider>
    </ReactQueryProvider>
  </StrictMode>,
);
