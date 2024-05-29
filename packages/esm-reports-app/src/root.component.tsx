import React from "react";
const swrConfiguration = {
  errorRetryCount: 3,
};
import { SWRConfig } from "swr";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomeDashboard from "./reports-dashboard/home-dashboard.component";

const RootComponent: React.FC = () => {
  const baseName = window.getOpenmrsSpaBase() + "home/reports";

  return (
    <main>
      <SWRConfig value={swrConfiguration}>
        <BrowserRouter basename={baseName}>
          <Routes>
            <Route path="/" element={<HomeDashboard />} />
          </Routes>
        </BrowserRouter>
      </SWRConfig>
    </main>
  );
};

export default RootComponent;
