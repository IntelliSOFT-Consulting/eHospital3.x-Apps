import React from "react";
import { SWRConfig } from "swr";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PatientVisitsReportHome from "./home-dashboard/home-dashboard.component";

const swrConfiguration = {
  errorRetryCount: 3,
};

const RootComponent: React.FC = () => {
  const baseName = window.getOpenmrsSpaBase() + "home/patients-visits-dashboard";

  return (
    <main>
      <SWRConfig value={swrConfiguration}>
        <BrowserRouter basename={baseName}>
          <Routes>
            <Route path="/" element={<PatientVisitsReportHome />} />
          </Routes>
        </BrowserRouter>
      </SWRConfig>
    </main>
  );
};

export default RootComponent;
