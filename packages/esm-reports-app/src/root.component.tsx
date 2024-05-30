import React from "react";
import { SWRConfig } from "swr";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const swrConfiguration = {
  errorRetryCount: 3,
};

const RootComponent: React.FC = () => {
  const baseName = window.getOpenmrsSpaBase() + "home/reports";

  return (
    <main>
      <SWRConfig value={swrConfiguration}>
        <BrowserRouter basename={baseName}>
          <Routes>
            <Route path="/" />
          </Routes>
        </BrowserRouter>
      </SWRConfig>
    </main>
  );
};

export default RootComponent;
