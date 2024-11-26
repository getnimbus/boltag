import React, { Suspense } from "react";
import { Toaster } from "sonner";
import { TailSpin } from "react-loader-spinner";
import { RouterProvider, createRouter } from "@tanstack/react-router";

import { routeTree } from "./routeTree.gen";
import { ThemeProvider } from "./contexts/ThemeContext";

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function App() {
  return (
    <ThemeProvider>
      <React.Fragment>
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-screen">
              <TailSpin
                visible={true}
                height="60"
                width="60"
                color="#1e96fc"
                ariaLabel="tail-spin-loading"
                radius="1"
                wrapperStyle={{}}
                wrapperClass=""
              />
            </div>
          }
        >
          <Toaster expand={true} position="top-center" theme="light" />
          <RouterProvider router={router} />
        </Suspense>
      </React.Fragment>
    </ThemeProvider>
  );
}

export default App;
