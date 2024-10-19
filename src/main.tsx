import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from "./App.tsx";
import ReactQueryProvider from "./providers/ReactQueryProvider.tsx";
import { Footer } from "./components/Footer.tsx";

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
      <App />
      <Footer />
    </ReactQueryProvider>
  </StrictMode>,
);
