import {
  Button,
  ComboButton,
  DataTable,
  DataTableSkeleton,
  InlineLoading,
  MenuItem,
  OverflowMenu,
  OverflowMenuItem,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  TableToolbar,
  TableToolbarContent,
  TableToolbarSearch,
  Modal
} from '@carbon/react';
import { Add, CategoryAdd, Download, Upload, WatsonHealthScalpelSelect } from '@carbon/react/icons';
import { ErrorState, showModal, useLayoutType, usePagination, useConfig, navigate } from '@openmrs/esm-framework';
import { EmptyState, usePaginationInfo } from '@openmrs/esm-patient-common-lib';
import React, { useMemo, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { convertToCurrency } from '../../helpers';
import styles from './charge-summary-table.scss';
import { useChargeSummaries } from './charge-summary.resource';
import { searchTableData } from './form-helper';
import AddServiceForm from './services/service-form.workspace';

const defaultPageSize = 10;

const ChargeSummaryTable: React.FC = () => {
  const { t } = useTranslation();
  const layout = useLayoutType();
  const size = layout === 'tablet' ? 'lg' : 'md';
  const { isLoading, isValidating, error, mutate, chargeSummaryItems } = useChargeSummaries();
  const { defaultCurrency } = useConfig();

  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [searchString, setSearchString] = useState('');
  const [showOverlay, setShowOverlay] = useState(false);

  const searchResults = useMemo(
    () => searchTableData(chargeSummaryItems, searchString),
    [chargeSummaryItems, searchString],
  );

  const { results, goTo, currentPage } = usePagination(searchResults, pageSize);
  const { pageSizes } = usePaginationInfo(defaultPageSize, chargeSummaryItems.length, currentPage, results.length);

  const headers = [
    {
      key: 'name',
      header: t('name', 'Name'),
    },
    {
      key: 'shortName',
      header: t('shortName', 'Short Name'),
    },
    {
      key: 'serviceStatus',
      header: t('status', 'Status'),
    },
    {
      key: 'serviceType',
      header: t('type', 'Type'),
    },
    {
      key: 'servicePrices',
      header: t('prices', 'Prices'),
    },
  ];

  const rows = useMemo(() => 
    results.map((service) => ({
      id: service.uuid,
      name: service.name,
      shortName: service.shortName,
      serviceStatus: service.serviceStatus,
      serviceType: service?.serviceType?.display ?? t('stockItem', 'Stock Item'),
      servicePrices: service.servicePrices
        .map((price) => `${price.name} : ${convertToCurrency(price.price, defaultCurrency)}`)
        .join(', '),
    })),
  [results, t, defaultCurrency]);

  const launchServiceChargeItem = useCallback(() => {
    navigate({ to: window.getOpenmrsSpaBase() + 'billing/charge-items/add-charge-service' });
  }, []);

  const openBulkUploadModal = useCallback(() => {
    const dispose = showModal('bulk-import-billable-services-modal', {
      closeModal: () => dispose(),
    });
  }, []);

  if (isLoading) {
    return <DataTableSkeleton headers={headers} aria-label="sample table" showHeader={false} showToolbar={false} />;
  }

  if (error) {
    return <ErrorState error={error} headerTitle={t('billableServicesError', 'Billable services error')} />;
  }

  if (!chargeSummaryItems.length) {
    return (
      <EmptyState
        headerTitle={t('chargeItems', 'Charge Items')}
        launchForm={launchServiceChargeItem}
        displayText={t('chargeItemsDescription', 'Charge Items')}
      />
    );
  }

  return (
    <>
      <DataTable size={size} useZebraStyles rows={rows} headers={headers}>
        {({ rows, headers, getHeaderProps, getRowProps, getTableProps, getToolbarProps, getTableContainerProps }) => (
          <TableContainer className={styles.tableContainer} {...getTableContainerProps()}>
            <TableToolbar {...getToolbarProps()} aria-label="data table toolbar">
              <TableToolbarContent>
                <TableToolbarSearch
                  placeHolder={t('searchForChargeItem', 'Search for charge item')}
                  onChange={(e) => setSearchString(e.target.value)}
                  persistent
                  size={size}
                />
                {isValidating && (
                  <InlineLoading status="active" iconDescription="Loading" description="Loading data..." />
                )}
                <ComboButton tooltipAlignment="left" label={t('actions', 'Action')}>
                  <MenuItem
                    renderIcon={CategoryAdd}
                    onClick={() => {
                      navigate({ to: window.getOpenmrsSpaBase() + 'billing/charge-items/add-charge-service' });
                    }}
                    label={t('addServiceChargeItem', 'Add charge service')}
                  />
                  <MenuItem
                    renderIcon={WatsonHealthScalpelSelect}
                    onClick={() => {
                      navigate({ to: window.getOpenmrsSpaBase() + 'billing/charge-items/add-charge-item' });
                    }}
                    label={t('addCommodityChargeItem', 'Add charge item')}
                  />
                  <MenuItem onClick={openBulkUploadModal} label={t('bulkUpload', 'Bulk Upload')} renderIcon={Upload} />
                  <MenuItem
                    label={t('downloadTemplate', 'Download template')}
                    renderIcon={Download}
                  />
                </ComboButton>
              </TableToolbarContent>
            </TableToolbar>
            <Table {...getTableProps()} aria-label={t('chargeItem', 'Charge items table')}>
              <TableHead>
                <TableRow>
                  {headers.map((header) => (
                    <TableHeader
                      key={header.key}
                      {...getHeaderProps({
                        header,
                      })}
                    >
                      {header.header}
                    </TableHeader>
                  ))}
                  <TableHeader aria-label={t('overflowMenu', 'Overflow menu')} />
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, index) => (
                  <TableRow
                    key={row.id}
                    {...getRowProps({
                      row,
                    })}
                  >
                    {row.cells.map((cell) => (
                      <TableCell key={cell.id}>{cell.value}</TableCell>
                    ))}
                    <TableCell className="cds--table-column-menu">
                      <OverflowMenu size={size} flipped>
                        <OverflowMenuItem
                          itemText={t('editChargeItem', 'Edit charge item')}
                          // onClick={() => handleEdit(results[index])}
                        />
                      </OverflowMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DataTable>
      <Pagination
        backwardText={t('previousPage', 'Previous page')}
        forwardText={t('nextPage', 'Next page')}
        itemsPerPageText={t('itemsPerPage', 'Items per page')}
        onChange={({ page, pageSize }) => {
          setPageSize(pageSize);
          goTo(page);
        }}
        page={currentPage}
        pageSize={defaultPageSize}
        pageSizes={pageSizes}
        size="sm"
        totalItems={chargeSummaryItems.length}
      />
    </>
  );
};

export default ChargeSummaryTable;
