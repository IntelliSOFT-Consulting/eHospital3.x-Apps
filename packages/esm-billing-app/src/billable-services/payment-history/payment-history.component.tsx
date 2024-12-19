import React from 'react';
import { useTranslation } from 'react-i18next';
import BillingHeader from '../../billing-header/billing-header.component';
import LeftPanel from '../../left-panel/left-panel.component';
import { PaymentDashboard } from './payment-dashboard.component';
// import { PaymentHistoryViewer } from './payment-history-viewer.component';

export const PaymentHistory = () => {
  const { t } = useTranslation();
  return (
    <div>
      <LeftPanel />
      <BillingHeader title={t('paymentHistory', 'Payment History')} />
      {/* <PaymentHistoryViewer /> */}
      <PaymentDashboard />
    </div>
  );
};
