import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@carbon/react';
import { showModal, launchWorkspace } from '@openmrs/esm-framework';
import { type Order } from '@openmrs/esm-patient-common-lib';
import OrderActionExtension from './order-action-extension.component';
import { type Result } from '../../../../types';
import { launchOverlay } from '../../../../components/overlay/hook';
import PostProcedureForm from '../../../../form/post-procedures/post-procedure-form.component';
import styles from './action-button.scss';
import ActionButtonBase from './action-button-base';

type ActionButtonProps = {
  action: {
    actionName: string;
  };
  order: Result;
  patientUuid: string;
};

const ActionButton: React.FC<ActionButtonProps> = ({ action, order, patientUuid }) => {
  const { t } = useTranslation();

  const handleOpenProcedureResultForm = () => {
    launchWorkspace('procedure-report-form', {
      patientUuid,
      order,
    });
  };

  const showDialog = (actionName: string) => () => {
    const dispose = showModal(actionName, {
      closeModal: () => dispose(),
      order,
    });
  };

  switch (action.actionName) {
    case 'add-procedure-to-worklist-dialog':
      return (
        <ActionButtonBase
          actionName={action.actionName}
          onClick={showDialog(action.actionName)}
          kind="primary"
          className={styles.actionButtons}
        />
      );

    case 'postProcedureResultForm':
      return (
        <Button kind="primary" onClick={handleOpenProcedureResultForm} size="md" className={styles.actionButtons}>
          {t('procedureResultForm', 'Procedure Result Form')}
        </Button>
      );

    case 'reject-procedure-order-dialog':
      return (
        <ActionButtonBase
          actionName={action.actionName}
          onClick={showDialog(action.actionName)}
          kind="danger"
          className={styles.actionButtons}
        />
      );

    default:
      return null;
  }
};

export default ActionButton;
