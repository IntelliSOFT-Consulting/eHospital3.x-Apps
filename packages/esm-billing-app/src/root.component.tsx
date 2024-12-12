import React,{useEffect} from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { BillingDashboard } from './billing-dashboard/billing-dashboard.component';
import Invoice from './invoice/invoice.component';
import { navigate } from '@openmrs/esm-framework';
import styles from './root.scss';
import { SideNav } from '@carbon/react';
import { SideNavItems } from '@carbon/react';
import { SideNavLink } from '@carbon/react';
import { useTranslation } from 'react-i18next';

import { ChargeItemsDashboard } from './billable-services/dashboard/charge-items-dashboard.component';
import AddServiceForm from './billable-services/billables/services/service-form.workspace';
import CommodityForm from './billable-services/billables/commodity/commodity-form.workspace';

import { PaymentPoints } from './payment-points/payment-points.component';
import { PaymentPoint } from './payment-points/payment-point/payment-point.component';

import { PaymentHistory } from './billable-services/payment-history/payment-history.component';

const RootComponent: React.FC = () => {
  const basePath = `${window.spaBase}/billing`;
  const { t } = useTranslation();

  const handleNavigation = (path: string) => {
    navigate({ to: `${basePath}/${path}` });
  };

  const handleCloseAddService = () => {
    navigate({ to: `${basePath}/charge-items` });
  };

  return (
    <BrowserRouter basename={basePath}>
      <main className={styles.container}>
      <section>
          <SideNav>
            <SideNavItems>
              <SideNavLink onClick={() => handleNavigation('')} isActive>
                {t('billingOverview', 'Billing Overview')}
              </SideNavLink>
              <SideNavLink onClick={() => handleNavigation('charge-items')}>
                {t('chargeItems', 'Charge Items')}
              </SideNavLink>
              <SideNavLink onClick={() => handleNavigation('payment-points')}>
                {t('paymentPoints', 'Payment Points')}
              </SideNavLink>
              <SideNavLink onClick={() => handleNavigation('payment-history')}>
                {t('paymentHistory', 'Payment History')}
              </SideNavLink>
            </SideNavItems>
          </SideNav>
        </section>
        <Routes>
          <Route path="/" element={<BillingDashboard />} />
          <Route path="/charge-items" element={<ChargeItemsDashboard />} />
          <Route path="/charge-items/add-charge-service" element={<AddServiceForm onClose={handleCloseAddService}/>} />
          <Route path="/charge-items/add-charge-item" element={<CommodityForm onClose={handleCloseAddService}/>} />

          <Route path="/payment-points" element={<PaymentPoints />} />
          <Route path="/payment-points/:paymentPointUUID" element={<PaymentPoint />} />

          <Route path='/payment-history' element={<PaymentHistory />} />
          
          <Route path="/patient/:patientUuid/:billUuid" element={<Invoice />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
};
export default RootComponent;
