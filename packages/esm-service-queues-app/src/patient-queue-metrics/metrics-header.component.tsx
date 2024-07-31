import { ComboButton, MenuItem } from '@carbon/react';
import {
  UserHasAccess,
  isDesktop,
  launchWorkspace,
  navigate,
  showModal,
  useLayoutType,
  useSession,
  ExtensionSlot
} from '@openmrs/esm-framework';
import { Add } from '@carbon/react/icons';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { spaBasePath } from '../constants';
import styles from './metrics-header.scss';

const MetricsHeader = () => {
  const { t } = useTranslation();
  const metricsTitle = t('clinicMetrics', 'Clinic metrics');
  const queueScreenText = t('queueScreen', 'Queue screen');
  const currentUserSession = useSession();
  const providerUuid = currentUserSession?.currentProvider?.uuid;
  const layout = useLayoutType();

  const navigateToQueueScreen = () => {
    navigate({ to: `${spaBasePath}/service-queues/screen` });
  };
  return (
    <div className={styles.metricsContainer}>
      {/* <span className={styles.metricsTitle}>{metricsTitle}</span> */}
      <div className={styles.headerButtons}>
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
        </div>
      {/* <ComboButton
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
      </ComboButton> */}
    </div>
  );
};

export default MetricsHeader;
