import React from 'react';
import {
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  DataTable,
  TableContainer,
  DataTableSkeleton,
} from '@carbon/react';
import { useTranslation } from 'react-i18next';
import { convertToCurrency } from '../../helpers';
import { usePaymentModeGroupTotals } from './usePaymentModeGroupTotals';
import { usePaymentFilterContext } from './usePaymentFilterContext';
import EmptyPatientBill from './empty-patient-bill.component';
import { useLayoutType, useConfig } from '@openmrs/esm-framework';
import { usePaymentTransactionHistory } from './usePaymentTransactionHistory';
import LeftPanel from '../../left-panel/left-panel.component';

const PaymentMethodDistribution = () => {
  const { t } = useTranslation();
  const responsiveSize = useLayoutType() !== 'tablet' ? 'sm' : 'md';
  const { filters } = usePaymentFilterContext();
  const { bills: filteredBills, isLoading } = usePaymentTransactionHistory(filters);
  const paymentModesGroupTotals = usePaymentModeGroupTotals(filteredBills);
  const {defaultCurrency} = useConfig()

  const rows = paymentModesGroupTotals.map((total, index) => ({
    id: index.toString(),
    paymentMode: total?.type,
    total: convertToCurrency(total?.total as number, defaultCurrency),
  }));

  const headers = [
    {
      key: 'paymentMode',
      header: t('paymentMode', 'Payment Mode'),
    },
    {
      key: 'total',
      header: t('total', 'Total'),
    },
  ];

  const computedTotal = paymentModesGroupTotals.reduce((acc, total) => acc + total?.total, 0);

  if (isLoading) {
    return <DataTableSkeleton headers={headers} aria-label="sample table" />;
  }

  if (computedTotal === 0) {
    return (
      <EmptyPatientBill
        title={t('noPaymentModes', 'No payment modes found')}
        subTitle={t('noPaymentModesSubtitle', 'No payment modes found for the selected filters')}
      />
    );
  }

  return (
    <>
    <LeftPanel />
    <DataTable useZebraStyles size={responsiveSize} rows={rows} headers={headers}>
      {({ rows, headers, getHeaderProps, getRowProps, getTableProps, getTableContainerProps }) => (
        <TableContainer {...getTableContainerProps()}>
          <Table {...getTableProps()} aria-label="sample table">
            <TableHead>
              <TableRow>
                {headers.map((header) => (
                  <TableHeader
                    key={header.key}
                    {...getHeaderProps({
                      header,
                    })}>
                    {header.header}
                  </TableHeader>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow
                  key={row.id}
                  {...getRowProps({
                    row,
                  })}>
                  {row.cells.map((cell) => (
                    <TableCell key={cell.id}>{cell.value}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </DataTable>
    </>
  );
};

export default PaymentMethodDistribution;
