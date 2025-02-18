import React, { useMemo, useState } from 'react';
import { usePaymentModes } from '../billing.resource';
import { CardHeader, EmptyState } from '@openmrs/esm-patient-common-lib';
import { useTranslation } from 'react-i18next';
import {
  DataTable,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  OverflowMenuItem,
  TableCell,
  OverflowMenu,
  TableExpandRow,
  TableExpandedRow,
  TableExpandHeader,
  Search,
  DataTableSkeleton,
  Button,
} from '@carbon/react';

import styles from './payment-mode-dashboard.scss';
import { formatDate, launchWorkspace, showModal, useDebounce } from '@openmrs/esm-framework';
import { PaymentMode } from '../types';
import startCase from 'lodash/startCase';

type PaymentModeDashboardProps = {};

const PaymentModeDashboard: React.FC<PaymentModeDashboardProps> = () => {
  const { t } = useTranslation();
  const size = 'md';
  const { paymentModes = [], isLoading } = usePaymentModes(false);
  const [searchTerm, setSearchTerm] = useState('');

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const filteredPaymentModes = useMemo(() => {
    return (
      paymentModes.filter((paymentMode) =>
        paymentMode.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()),
      ) ?? []
    );
  }, [paymentModes, debouncedSearchTerm]);

  const handleSearch = (searchTerm: string) => {
    setSearchTerm(searchTerm);
  };

  const showDeletePaymentModeModal = (paymentMode: PaymentMode) => {
    const dispose = showModal('delete-payment-mode-modal', {
      closeModal: () => dispose(),
      paymentMode,
    });
  };

  const createPaymentModeModal = (paymentMode: PaymentMode, modalTitle: string) => {
    const dispose = showModal('create-payment-mode', {
          closeModal: () => dispose(),
          initialPaymentMode: paymentMode,
          modalTitle,
        });
  }

  if (isLoading) {
    return <DataTableSkeleton />;
  }

  const headers = [
    {
      key: 'dateCreated',
      header: t('dateCreated', 'Date Created'),
    },
    {
      key: 'name',
      header: t('name', 'Name'),
    },
    {
      key: 'description',
      header: t('description', 'Description'),
    },
    {
      key: 'retired',
      header: t('retired', 'Retired'),
    },
  ];

  const rows = filteredPaymentModes.map((paymentMode) => ({
    id: `${paymentMode.uuid}`,
    name: paymentMode.name,
    description: paymentMode.description,
    dateCreated: formatDate(new Date(paymentMode.auditInfo.dateCreated), {
      mode: 'standard',
      time: false,
      noToday: true,
    }),
    retired: paymentMode.retired ? t('yes', 'Yes') : t('no', 'No'),
  }));

  return (
    <div className={styles.container}>
      <CardHeader title="Payment Modes">
        <Button
          onClick={() =>
            createPaymentModeModal(paymentModes[''], t('createPaymentMode', 'Create Payment Mode'))
          }
          className={styles.createPaymentModeButton}
          size="md">
          {t('addPaymentMode', 'Add Payment Mode')}
        </Button>
      </CardHeader>
      {paymentModes.length === 0 ? (
        <EmptyState
          displayText={t('noPaymentModes', 'No payment modes')}
          headerTitle={t('', '')}
          launchForm={() =>
            launchWorkspace('payment-mode-workspace', {
              workspaceTitle: t('addPaymentMode', 'Add Payment Mode'),
            })
          }
        />
      ) : (
        <div className={styles.dataTable}>
          <Search
            size={size}
            placeholder={t('searchPaymentMode', 'Search payment mode table')}
            labelText={t('searchLabel', 'Search')}
            closeButtonLabelText={t('clearSearch', 'Clear search input')}
            id="search-1"
            onChange={(event) => handleSearch(event.target.value)}
          />
          <DataTable useZebraStyles size={size} rows={rows} headers={headers}>
            {({ rows, headers, getHeaderProps, getRowProps, getTableProps, getExpandedRowProps }) => (
              <TableContainer>
                <Table {...getTableProps()} aria-label="sample table">
                  <TableHead>
                    <TableRow>
                      <TableExpandHeader aria-label="expand row" />
                      {headers.map((header, i) => (
                        <TableHeader
                          key={i}
                          {...getHeaderProps({
                            header,
                          })}>
                          {header.header}
                        </TableHeader>
                      ))}
                      <TableHeader aria-label="overflow actions" />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row, index) => (
                      <React.Fragment key={row.id}>
                        <TableExpandRow
                          {...getRowProps({
                            row,
                          })}>
                          {row.cells.map((cell) => (
                            <TableCell key={cell.id}>{cell.value}</TableCell>
                          ))}
                          <TableCell className="cds--table-column-menu">
                            <OverflowMenu size={size} iconDescription={t('actions', 'Actions')} flipped>
                              <OverflowMenuItem
                                onClick={() =>
                                  createPaymentModeModal(
                                    paymentModes[index],
                                    t('editPaymentMode', 'Edit Payment Mode'),
                                  )
                                }
                                itemText={t('edit', 'Edit')}
                              />
                              <OverflowMenuItem
                                hasDivider
                                isDelete
                                onClick={() => showDeletePaymentModeModal(paymentModes[index])}
                                itemText={t('delete', 'Delete')}
                              />
                            </OverflowMenu>
                          </TableCell>
                        </TableExpandRow>
                        <TableExpandedRow
                          colSpan={headers.length + 1}
                          className="demo-expanded-td"
                          {...getExpandedRowProps({
                            row,
                          })}>
                        </TableExpandedRow>
                      </React.Fragment>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </DataTable>
        </div>
      )}
    </div>
  );
};

export default PaymentModeDashboard;

// const PaymentModeAttributes: React.FC<PaymentMode> = (paymentMode) => {
//   const { t } = useTranslation();
//   const { attributeTypes } = paymentMode;

//   return (
//     <div className={styles.attributeContainer}>
//       {attributeTypes.map((attributeType) =>
//         Object.entries(attributeType).map(([key, value]) => {
//           return <AttributeCard key={key} label={key} value={JSON.stringify(value)} />;
//         }),
//       )}
//     </div>
//   );
// };

// const AttributeCard: React.FC<{ label: string; value: string }> = ({ label, value }) => {
//   return (
//     <div className={styles.attributeCard}>
//       <div className={styles.attributeLabel}>{startCase(label).replace(/\s+/g, ' ')}</div>
//       <div className={styles.attributeValue}>{value.replace(/['"]/g, '')}</div>
//     </div>
//   );
// };
