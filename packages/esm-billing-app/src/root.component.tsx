import React,{useEffect} from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { BillingDashboard } from './billing-dashboard/billing-dashboard.component';
import Invoice from './invoice/invoice.component';
import { navigate, setLeftNav, unsetLeftNav } from '@openmrs/esm-framework';
import LeftPanel from './left-panel/left-panel.component';

import styles from './root.scss';
import { useTranslation } from 'react-i18next';

import { ChargeItemsDashboard } from './billable-services/dashboard/charge-items-dashboard.component';
import AddServiceForm from './billable-services/billables/services/service-form.workspace';
import CommodityForm from './billable-services/billables/commodity/commodity-form.workspace';

import { PaymentPoints } from './payment-points/payment-points.component';
import { PaymentPoint } from './payment-points/payment-point/payment-point.component';

import { PaymentHistory } from './billable-services/payment-history/payment-history.component';
import PaymentModeHome from "./payment-modes/payment-mode-home.component";

const RootComponent: React.FC = () => {
  const { t } = useTranslation();
  const billingSpaBasePath = window.getOpenmrsSpaBase() + 'billing';
  const spaBasePath = window.spaBase;

  useEffect(() => {
    setLeftNav({
      name: 'billing-left-panel-slot',
      basePath: spaBasePath,
    });
    return () => unsetLeftNav('billing-left-panel-slot');
  }, [spaBasePath]);

  const handleCloseAddService = () => {
    navigate({ to: `${billingSpaBasePath}/charge-items` });
  };

  return (
    <BrowserRouter basename={billingSpaBasePath}>
      <LeftPanel />
      <main className={styles.container}>
        <Routes>
          <Route path="/" element={<BillingDashboard />} />
          <Route path="/charge-items" element={<ChargeItemsDashboard />} />
          <Route path="/charge-items/add-charge-service" element={<AddServiceForm onClose={handleCloseAddService}/>} />
          <Route path="/charge-items/add-charge-item" element={<CommodityForm onClose={handleCloseAddService}/>} />

          <Route path="/payment-point" element={<PaymentPoints />} />
          <Route path="/payment-points/:paymentPointUUID" element={<PaymentPoint />} />

          <Route path="/payment-mode" element={<PaymentModeHome />} />

          <Route path='/payment-history' element={<PaymentHistory />} />

          <Route path="/patient/:patientUuid/:billUuid" element={<Invoice />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
};
export default RootComponent;
