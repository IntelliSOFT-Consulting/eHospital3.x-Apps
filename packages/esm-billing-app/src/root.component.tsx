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

const RootComponent: React.FC = () => {
  const basePath = `${window.spaBase}/billing`;
  const { t } = useTranslation();

  const handleNavigation = (path: string) => {
    navigate({ to: `${basePath}/${path}` });
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
            </SideNavItems>
          </SideNav>
        </section>
        <Routes>
          <Route path="/" element={<BillingDashboard />} />
          <Route path="/charge-items" element={<ChargeItemsDashboard />} />
          <Route path="/patient/:patientUuid/:billUuid" element={<Invoice />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
};
export default RootComponent;
