import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "sonner";
// import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from "./App.tsx";
import ReactQueryProvider from "./providers/ReactQueryProvider.tsx";
import SuiInstanceProvider from "./providers/SuiInstanceProvider.tsx";

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
      <SuiInstanceProvider>
        <Toaster
          expand={true}
          position="top-center"
          theme="light"
          toastOptions={{
            unstyled: false,
            classNames: {
              error: "text-[#f87171] border border-[#f87171]",
              success: "text-[#4ade80] border border-[#4ade80]",
              warning: "text-[#facc15] border border-[#facc15]",
              info: "text-[#60a5fa] border border-[#60a5fa]",
              default: "text-white border border-[#BCFD4F]",
            },
          }}
        />
        <Header />
        <App />
        <Footer />
      </SuiInstanceProvider>
    </ReactQueryProvider>
  </StrictMode>,
);
