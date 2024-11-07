import React, { Suspense } from "react";
import { Toaster } from "sonner";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { TailSpin } from "react-loader-spinner";

import { Footer } from "./components/Footer.tsx";
import { Header } from "./components/Header.tsx";

const MainLoadable = React.lazy(() => import("./pages/Main.tsx"));
const DashboardLoadable = React.lazy(() => import("./pages/Dashboard.tsx"));

function App() {
  return (
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
        <Router>
          <Header />
          <Routes>
            <Route path="/dashboard" element={<DashboardLoadable />} />
            <Route path="/" element={<MainLoadable />} />
            <Route path="*" element={<MainLoadable />} />
          </Routes>
          <Footer />
        </Router>
      </Suspense>
    </React.Fragment>
  );
}

export default App;
