import React, { type ComponentProps, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@carbon/react';
import { ArrowLeftIcon, useLayoutType, Workspace2 } from '@openmrs/esm-framework';
import {
  type OrderBasketItem,
  type OrderBasketWindowProps,
  type PatientWorkspace2DefinitionProps,
} from '@openmrs/esm-patient-common-lib';
import { TestTypeSearch } from './procedures-type-search';
import { ProceduresOrderForm } from './procedures-order-form.component';
import styles from './add-procedures-order.scss';
import { type ProcedureOrderBasketItem } from '../../../types';

export interface AddProceduresOrderWorkspaceProps {
  order?: OrderBasketItem;
}

/**
 * This workspace displays the procedure order form for:
 * 1. adding a new procedure order
 * 2. editing a pending (un-submitted) procedure order in the order basket
 *
 * This workspace must only be used within the patient chart.
 */
export default function AddProceduresOrderWorkspace({
  workspaceProps,
  groupProps: { patient },
  closeWorkspace,
}: PatientWorkspace2DefinitionProps<AddProceduresOrderWorkspaceProps, OrderBasketWindowProps>) {
  const { t } = useTranslation();
  const isTablet = useLayoutType() === 'tablet';
  const initialOrder = workspaceProps?.order as ProcedureOrderBasketItem | undefined;
  const [currentLabOrder, setCurrentLabOrder] = useState(initialOrder);

  const workspaceTitle = t('addProcedureOrderWorkspaceTitle', 'Add procedure order');

  if (!currentLabOrder) {
    return (
      <Workspace2 title={workspaceTitle}>
        {!isTablet && (
          <div className={styles.backButton}>
            <Button
              kind="ghost"
              renderIcon={(props: ComponentProps<typeof ArrowLeftIcon>) => <ArrowLeftIcon size={24} {...props} />}
              iconDescription="Return to order basket"
              size="sm"
              onClick={() => closeWorkspace()}>
              <span>{t('backToOrderBasket', 'Back to order basket')}</span>
            </Button>
          </div>
        )}
        <TestTypeSearch openLabForm={setCurrentLabOrder} patient={patient} closeWorkspace={closeWorkspace} />
      </Workspace2>
    );
  }

  return (
    <ProceduresOrderForm
      initialOrder={currentLabOrder}
      patient={patient}
      closeWorkspace={closeWorkspace}
      onCancel={() => setCurrentLabOrder(undefined)}
    />
  );
}
