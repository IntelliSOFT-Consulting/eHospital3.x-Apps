import React, { useEffect, useMemo, useState } from 'react';
import { DataTableSkeleton, Dropdown, TableToolbarSearch, ComboButton, MenuItem } from '@carbon/react';
import { Add } from '@carbon/react/icons';
import { ExtensionSlot, isDesktop, launchWorkspace, showSnackbar, showToast, useLayoutType, UserHasAccess, showModal, useSession, navigate } from '@openmrs/esm-framework';
import { useTranslation } from 'react-i18next';
import ClearQueueEntries from '../clear-queue-entries-dialog/clear-queue-entries.component';
import {
  updateSelectedServiceName,
  updateSelectedServiceUuid,
  useSelectedQueueLocationUuid,
  useSelectedServiceName,
  useSelectedServiceUuid,
} from '../helpers/helpers';
import { useQueues } from '../hooks/useQueues';
import { useQueueEntries } from '../hooks/useQueueEntries';
import QueueTableExpandedRow from './queue-table-expanded-row.component';
import QueueTable from './queue-table.component';
import styles from './queue-table.scss';
import { useColumns } from './cells/columns.resource';
import { spaBasePath } from '../constants';

/*
Component with default values / sub-components passed into the more generic QueueTable.
This is used in the main dashboard of the queues app. (Currently behind a feature flag)
*/
function DefaultQueueTable() {
  const selectedQueueUuid = useSelectedServiceUuid();
  const currentLocationUuid = useSelectedQueueLocationUuid();
  const {queueEntries, isLoading, error, mutate} = useQueueEntries({
    queue: selectedQueueUuid,
    location: currentLocationUuid,
    isEnded: false,
  });

  const { t } = useTranslation();
  const queueScreenText = t('queueScreen', 'Queue screen');
  const currentUserSession = useSession();
  const providerUuid = currentUserSession?.currentProvider?.uuid;


  useEffect(() => {
    if (error?.message) {
      showSnackbar({
        title: t('errorLoadingQueueEntries', 'Error loading queue entries'),
        kind: 'error',
        subtitle: error?.message,
      });
    }
  }, [error?.message]);
  const layout = useLayoutType();

  const columns = useColumns(null, null);
  if (!columns) {
    showToast({
      title: t('notableConfig', 'No table configuration'),
      kind: 'warning',
      description: 'No table configuration defined for queue: null and status: null',
    });
  }

  const [searchTerm, setSearchTerm] = useState('');

  const filteredQueueEntries = useMemo(() => {
    const searchTermLowercase = searchTerm.toLowerCase();
    return queueEntries?.filter((queueEntry) => {
      return columns.some((column) => {
        const columnSearchTerm = column.getFilterableValue?.(queueEntry)?.toLocaleLowerCase();
        return columnSearchTerm?.includes(searchTermLowercase);
      });
    });
  }, [queueEntries, searchTerm]);

  useEffect(() => {
    const handlePatientAddedToQueue = () => mutate()


    window.addEventListener('refetchQueues', handlePatientAddedToQueue);
    return () => {
      window.removeEventListener('refetchQueues', handlePatientAddedToQueue);
    }

  }, []);

  if (isLoading) {
    return <DataTableSkeleton role="progressbar" />;
  }

  const navigateToQueueScreen = () => {
    navigate({ to: `${spaBasePath}/service-queues/screen` });
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerContainer}>
        <div className={!isDesktop(layout) ? styles.tabletHeading : styles.desktopHeading}>
          <h4>{t('patientsCurrentlyInQueue', 'Patients currently in queue')}</h4>
        </div>
        {/* <div className={styles.headerButtons}>
          <ExtensionSlot
            name="patient-search-button-slot"
            state={{
              buttonText: t('addPatientToQueue', 'Add patient to queue'),
              overlayHeader: t('addPatientToQueue', 'Add patient to queue'),

              buttonProps: {
                kind: 'secondary',
                renderIcon: (props) => <Add size={16} {...props} />,
                size: 'sm',
              },
              selectPatientAction: (selectedPatientUuid) => {
                launchWorkspace('service-queues-patient-search', { viewState: { selectedPatientUuid } });
              },
            }}
          />
        </div> */}
        <ComboButton
          label={queueScreenText}
          size={isDesktop(layout) ? 'sm' : 'lg'}
          menuAlignment="bottom-end"
          className={styles.comboBtn}
          tooltipAlignment="top-right"
          onClick={navigateToQueueScreen}>
          <UserHasAccess privilege="Emr: View Legacy Interface">
            <MenuItem
              label={t('addNewService', 'Add new service')}
              onClick={() => launchWorkspace('service-queues-service-form')}
            />
            <MenuItem
              label={t('addNewServiceRoom', 'Add new service room')}
              onClick={() => launchWorkspace('service-queues-room-form')}
            />
          </UserHasAccess>
          <MenuItem
            label={t('addProviderQueueRoom', 'Add provider queue room')}
            onClick={() => {
              const dispose = showModal('add-provider-to-room-modal', {
                closeModal: () => dispose(),
                providerUuid,
              });
            }}
          />
        </ComboButton>
      </div>
      <QueueTable
        queueEntries={filteredQueueEntries ?? []}
        queueUuid={null}
        statusUuid={null}
        ExpandedRow={QueueTableExpandedRow}
        tableFilter={[
          <QueueDropdownFilter />,
          <TableToolbarSearch
            className={styles.search}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('searchThisList', 'Search this list')}
            size={isDesktop(layout) ? 'sm' : 'lg'}
          />,
          <ClearQueueEntries queueEntries={filteredQueueEntries} />,
        ]}
      />
    </div>
  );
}

function QueueDropdownFilter() {
  const { t } = useTranslation();
  const layout = useLayoutType();
  const currentQueueLocation = useSelectedQueueLocationUuid();
  const { queues } = useQueues(currentQueueLocation);
  const currentServiceName = useSelectedServiceName();
  const handleServiceChange = ({ selectedItem }) => {
    updateSelectedServiceUuid(selectedItem.uuid);
    updateSelectedServiceName(selectedItem.display);
  };

  return (
    <>
      <div className={styles.filterContainer}>
        <Dropdown
          id="serviceFilter"
          titleText={t('showPatientsWaitingFor', 'Show patients waiting for') + ':'}
          label={currentServiceName}
          type="inline"
          items={[{ display: `${t('all', 'All')}` }, ...queues]}
          itemToString={(item) => (item ? item.display : '')}
          onChange={handleServiceChange}
          size={isDesktop(layout) ? 'sm' : 'lg'}
        />
      </div>
    </>
  );
}

export default DefaultQueueTable;
