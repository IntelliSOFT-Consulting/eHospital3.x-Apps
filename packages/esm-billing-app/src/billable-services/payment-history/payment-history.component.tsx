import React from 'react';
import { useTranslation } from 'react-i18next';
import BillingHeader from '../../billing-header/billing-header.component';
import { PaymentHistoryViewer } from './payment-history-viewer.component';
import LeftPanel from '../../left-panel/left-panel.component';

export const PaymentHistory = () => {
  const { t } = useTranslation();
  return (
    <div>
      <LeftPanel />
      <BillingHeader title={t('paymentHistory', 'Payment History')} />
      <PaymentHistoryViewer />
    </div>
  );
};
