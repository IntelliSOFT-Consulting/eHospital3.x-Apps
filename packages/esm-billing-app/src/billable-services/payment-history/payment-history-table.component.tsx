import React, { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Button,
  Pagination,
  DataTable,
  TableContainer,
  Search,
} from '@carbon/react';
import { EmptyState, usePaginationInfo } from '@openmrs/esm-patient-common-lib';
import { useTranslation } from 'react-i18next';
import { useBills } from '../../billing.resource';
import { MappedBill } from '../../types';
import styles from './payment-history.scss';
import { exportToExcel } from '../../helpers/excelExport';
import { convertToCurrency } from '../../helpers';
import dayjs from 'dayjs';
import { Download } from '@carbon/react/icons';
import { useConfig, usePagination, useLayoutType, useDebounce } from '@openmrs/esm-framework';
import LeftPanel from '../../left-panel/left-panel.component';
import { FilterDashboard } from './filters/filter-dashboard';

export const PaymentHistoryTable = ({
  headers,
  rows = [],
}: {
  headers: Array<Record<string, any>>;
  rows: Array<MappedBill>;
}) => {
  const { t } = useTranslation();
  const [pageSize, setPageSize] = useState(10);
  const responsiveSize = useLayoutType() !== 'tablet' ? 'sm' : 'md';
  const [searchString, setSearchString] = useState('');
  const debouncedSearchString = useDebounce(searchString, 1000);
  const { defaultCurrency } = useConfig();

  const searchResults = useMemo(() => {
    if (rows !== undefined && rows.length > 0) {
      if (debouncedSearchString && debouncedSearchString.trim() !== '') {
        const search = debouncedSearchString.toLowerCase();
        return rows?.filter((activeBillRow) =>
          Object.entries(activeBillRow).some(([header, value]) => {
            if (header === 'patientUuid') {
              return false;
            }
            return `${value}`.toLowerCase().includes(search);
          }),
        );
      }
    }

    return rows;
  }, [debouncedSearchString, rows]);

  const { currentPage, goTo, results } = usePagination(searchResults, pageSize);
  const { pageSizes } = usePaginationInfo(pageSize, rows.length, currentPage, results.length);

  const transformedRows = results.map((row) => {
    return {
      ...row,
      totalAmount: convertToCurrency(
        row.payments.reduce((acc, payment) => acc + payment.amountTendered, 0),
        defaultCurrency,
      ),
      referenceCodes: row.payments.map(({ attributes }) => attributes.map(({ value }) => value).join(' ')).join(', '),
    };
  });

  const handleExport = () => {
    const dataForExport = results.map((row) => {
      return {
        ...row,
        totalAmount: convertToCurrency(
          row.payments.reduce((acc, payment) => acc + payment.amountTendered, 0),
          defaultCurrency,
        ),
      };
    });
    const data = dataForExport.map((row: (typeof transformedRows)[0]) => {
      return {
        'Receipt Number': row.receiptNumber,
        'Patient ID': row.identifier,
        'Patient Name': row.patientName,
        'Mode of Payment': row.payments
          .map((payment: (typeof row.payments)[0]) => payment.instanceType.name)
          .join(', '),
        'Total Amount Due': row.lineItems.reduce((acc, item) => acc + item.price, 0),
        'Date of Payment': dayjs(row.payments[0].dateCreated).format('DD-MM-YYYY'),
        'Total Amount Paid': row.payments.reduce((acc, payment) => acc + payment.amountTendered, 0),
        'Reason/Reference': row.payments
          .map(({ attributes }) => attributes.map(({ value }) => value).join(' '))
          .join(', '),
      };
    });

    exportToExcel(data, {
      fileName: `Transaction History - ${dayjs().format('DDD-MMM-YYYY:HH-mm-ss')}`,
      sheetName: t('paymentHistory', 'Payment History'),
    });
  };

  if (results.length === 0) {
    return (
      <div className={styles.emptyStateWrapper}>
        <EmptyState
          displayText={t('noBillsFilter', 'No bills match that filter please adjust your filters')}
          headerTitle={t('noBillsHeader', 'No bills match the provided filters')}
        />
      </div>
    );
  }

  return (
    <div>
      <LeftPanel />
      <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
        <Search
          size="sm"
          placeholder={t('searchTransactions', 'Search transactions table')}
          labelText={t('searchTransactions', 'Search transactions table')}
          closeButtonLabelText={t('clearSearch', 'Clear search input')}
          id="search-transactions"
          onChange={(event) => setSearchString(event.target.value)}
        />

        <Button size={responsiveSize} renderIcon={Download} iconDescription="Download" onClick={handleExport}>
          {t('download', 'Download')}
        </Button>
      </div>
      <DataTable useZebraStyles size="sm" rows={transformedRows} headers={headers}>
        {({ rows, headers, getHeaderProps, getRowProps, getTableProps, getTableContainerProps }) => (
          <TableContainer {...getTableContainerProps()}>
            <Table {...getTableProps()} size="sm" aria-label="sample table">
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
      {pageSizes.length > 1 && (
        <Pagination
          forwardText={t('nextPage', 'Next page')}
          backwardText={t('previousPage', 'Previous page')}
          page={currentPage ?? 1}
          pageSize={pageSize ?? 10}
          pageSizes={pageSizes}
          totalItems={searchResults.length ?? 0}
          size={responsiveSize}
          onChange={({ page: newPage, pageSize }) => {
            if (newPage !== currentPage) {
              goTo(newPage);
            }
            setPageSize(pageSize);
          }}
        />
      )}
    </div>
  );
};
