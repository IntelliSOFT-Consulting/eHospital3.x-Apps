import React from 'react';
import { Button } from '@carbon/react';
import { navigate } from '@openmrs/esm-framework';
import ActionButton from './action-button.component';

interface OrderActionsProps {
  row: any;
  orders: any[];
  actions: any[];
  openmrsSpaBase: string;
  t: any;
  bills: any[];
}

const OrderActions: React.FC<OrderActionsProps> = ({
  row,
  orders,
  actions,
  openmrsSpaBase,
  t,
  bills,
}) => {
  const matchingBill = bills?.find(
    (bill) =>
      bill.status === 'PENDING' &&
      bill.lineItems?.some(
        (item) =>
          item.billableService?.toLowerCase() === row.procedure?.toLowerCase()
      )
  );

  if (matchingBill) {
    return (
      <Button
        onClick={() =>
          navigate({
            to: `${openmrsSpaBase}billing/patient/${row?.patient?.uuid}/${matchingBill.uuid}`,
          })
        }
        kind="primary"
        size="sm">
        {t('proceedToPayment', 'Proceed to Payment')}
      </Button>
    );
  }

  return (
    <>
      {actions.map((action) => (
        <ActionButton
          key={action.actionName}
          order={orders.find((order) => order.uuid === row.id)}
          patientUuid={row.patient.uuid}
          action={action}
        />
      ))}
    </>
  );
};

export default OrderActions;