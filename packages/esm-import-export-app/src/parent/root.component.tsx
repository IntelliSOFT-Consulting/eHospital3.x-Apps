import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ExportComponent from '../views/export.component';
import {SWRConfig} from "swr";

const swrConfiguration = {
  errorRetryCount: 3,
};

const Root: React.FC = () => {
  const serviceQueuesBasename = window.getOpenmrsSpaBase() + 'home/import-export';

  return (
    <main>
      <SWRConfig value={swrConfiguration}>
      <BrowserRouter basename={serviceQueuesBasename}>
        <Routes>
          <Route path="/" element={<ExportComponent />} />
        </Routes>
      </BrowserRouter>
      </SWRConfig>
    </main>
  );
};

export default Root;
