import React, { useMemo} from 'react';
import { useTranslation } from 'react-i18next';
import { usePaymentFilterContext } from './usePaymentFilterContext';
import { PaymentHistoryTable } from './payment-history-table.component';
import { usePaymentTransactionHistory } from './usePaymentTransactionHistory';
import { DataTableSkeleton } from '@carbon/react';
import LeftPanel from '../../left-panel/left-panel.component';
import styles from './payment-dashboard.scss';
import EmptyPatientBill from './empty-patient-bill.component';

export const PaymentHistoryViewer = () => {
  const { t } = useTranslation();
  const { filters } = usePaymentFilterContext();
  const { bills: filteredBills, isLoading } = usePaymentTransactionHistory(filters);

  const headers = useMemo(
    () => [
      { header: t('billDate', 'Date'), key: 'dateCreated' },
      { header: t('patientName', 'Patient Name'), key: 'patientName' },
      { header: t('identifier', 'Identifier'), key: 'identifier' },
      { header: t('totalAmount', 'Total Amount'), key: 'totalAmount' },
      { header: t('billingService', 'Service'), key: 'billingService' },
      { header: t('referenceCodes', ' Reference Codes'), key: 'referenceCodes' },
      { header: t('status', 'Status'), key: 'status' },
    ],
    [t],
  );
  return (
    <>
    <LeftPanel/>
      {isLoading ? (
        <DataTableSkeleton headers={headers} aria-label={t('transactionHistory', 'Transaction History')} />
      ) : filteredBills.length > 0 ? (
        <div className={styles.paymentDashboard}>
        <PaymentHistoryTable headers={headers} rows={filteredBills} />
        </div>
      ) : (<EmptyPatientBill
        title={t('noTransactionHistory', 'No transaction history')}
        subTitle={t('noTransactionHistorySubtitle', 'No transaction history loaded for the selected filters')}
      />)}
    </>
  );
};
