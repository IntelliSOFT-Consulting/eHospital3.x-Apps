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
  Modal,
  MenuButton,
} from '@carbon/react';
import { Add, CategoryAdd, Download, Upload, WatsonHealthScalpelSelect } from '@carbon/react/icons';
import {
  ErrorState,
  showModal,
  useLayoutType,
  usePagination,
  useConfig,
  navigate,
  showSnackbar,
} from '@openmrs/esm-framework';
import { EmptyState, usePaginationInfo } from '@openmrs/esm-patient-common-lib';
import React, { useMemo, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { convertToCurrency } from '../../helpers';
import styles from './charge-summary-table.scss';
import { useChargeSummaries } from './charge-summary.resource';
import { searchTableData, downloadExcelTemplateFile } from './form-helper';
import AddServiceForm from './services/service-form.workspace';
import CommodityForm from './commodity/commodity-form.workspace';

const defaultPageSize = 10;

const ChargeSummaryTable: React.FC = () => {
  const { t } = useTranslation();
  const layout = useLayoutType();
  const size = layout === 'tablet' ? 'lg' : 'md';
  const { isLoading, isValidating, error, mutate, chargeSummaryItems } = useChargeSummaries();
  const { defaultCurrency } = useConfig();

  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [searchString, setSearchString] = useState('');

  const [panelType, setPanelType] = useState<'service' | 'commodity' | null>(null);

  const [showOverlay, setShowOverlay] = useState(false);
  const [editingService, setEditingService] = useState(null);

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

  const rows = useMemo(
    () =>
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
    [results, t, defaultCurrency],
  );

  const launchServiceChargeItem = useCallback(() => {
    navigate({ to: window.getOpenmrsSpaBase() + 'billing/charge-items/add-charge-service' });
    setEditingService(null);
    setShowOverlay(true);
  }, []);

  const openBulkUploadModal = useCallback(() => {
    const dispose = showModal('bulk-import-billable-services-modal', {
      closeModal: () => dispose(),
    });
  }, []);

  const handleDeleteChargeItem = useCallback(
    (service) => {
      const dispose = showModal('delete-charge-item-modal', {
        closeModal: () => dispose(),
        selectedChargeItem: service,
        mutate,
      });
    },
    [mutate],
  );

  const handleAddService = useCallback(() => {
    setEditingService(null);
    setPanelType('service');
    setShowOverlay(true);
  }, []);

  const handleAddItem = useCallback(() => {
    setEditingService(null);
    setPanelType('commodity');
    setShowOverlay(true);
  }, []);

  const handleEditService = useCallback((service) => {
    setEditingService({...service});
    setPanelType('service');
    setShowOverlay(true);
  }, []);

  const closePanel = useCallback(() => {
    setShowOverlay(false);
    setEditingService(null);
    setPanelType(null);
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
                <MenuButton tooltipAlignment="left" label={t('actions', 'Action')}>
                  <MenuItem
                    renderIcon={CategoryAdd}
                    onClick={handleAddService}
                    label={t('addServiceChargeItem', 'Add charge service')}
                  />
                  <MenuItem
                    renderIcon={WatsonHealthScalpelSelect}
                    onClick={handleAddItem}
                    label={t('addCommodityChargeItem', 'Add charge item')}
                  />
                  <MenuItem onClick={openBulkUploadModal} label={t('bulkUpload', 'Bulk Upload')} renderIcon={Upload} />
                  <MenuItem
                    onClick={downloadExcelTemplateFile}
                    label={t('downloadTemplate', 'Download template')}
                    renderIcon={Download}
                  />
                </MenuButton>
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
                      })}>
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
                    })}>
                    {row.cells.map((cell) => (
                      <TableCell key={cell.id}>{cell.value}</TableCell>
                    ))}
                    <TableCell className="cds--table-column-menu">
                      <OverflowMenu size={size} flipped>
                        <OverflowMenuItem
                          itemText={t('editChargeItem', 'Edit charge item')}
                          onClick={() => handleEditService(results[index])}
                        />
                        <OverflowMenuItem
                          itemText={t('deleteChargeItem', 'Delete charge item')}
                          onClick={() => handleDeleteChargeItem(results[index])}
                          isDelete
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

      <div
        className={`
          ${styles.sidePanel} 
          ${showOverlay ? styles.open : ''}
        `}>
        <div className={styles.panelHeader}>
          <div>
            <h3 className={styles.panelTitle}>
              {editingService
                ? t('editChargeItem', 'Edit charge item')
                : panelType === 'service'
                  ? t('addService', 'Add Service')
                  : t('addCommodity', 'Add Commodity')}
            </h3>
          </div>
          <button onClick={closePanel} className={styles.closeButton}>
            &times;
          </button>
        </div>
        {showOverlay && panelType && (
          <div className={styles.panelContent}>
            {panelType === 'service' && (
              <AddServiceForm editingService={editingService} onClose={closePanel} mutate={mutate} />
            )}
            {panelType === 'commodity' && (
              <CommodityForm editingService={editingService} onClose={closePanel} mutate={mutate} />
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default ChargeSummaryTable;
