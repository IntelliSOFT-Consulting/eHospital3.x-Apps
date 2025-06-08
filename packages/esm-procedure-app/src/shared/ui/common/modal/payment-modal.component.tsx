import React from 'react';
import {
  DataTable,
  Button,
  ModalFooter,
  ComposedModal,
  ModalHeader,
  ModalBody
} from '@carbon/react';
import { useTranslation } from 'react-i18next';
import { formatDate, navigate, parseDate } from '@openmrs/esm-framework';
import styles from './payment-modal.scss';
import { useBills } from '../../../../hooks/useBilling';

const headers = [
  { key: 'orderNumber', header: 'Order Number' },
  { key: 'orderDate', header: 'Test Date (Today)' },
  { key: 'testOrdered', header: 'Test Ordered' },
  { key: 'paymentStatus', header: 'Payment Status'}
];


const PaymentStatusModal = ({ open, onClose, orders }) => {
const { t } = useTranslation();
const patientUuid = orders?.[0]?.patient?.uuid;
const { bills = [] } = useBills(patientUuid || '');
const openmrsSpaBase = window['getOpenmrsSpaBase']?.();

const rows =
    orders
    ?.filter(order => {
        const concept = order?.concept?.display;
        return bills.some(bill =>
        bill?.status === 'PENDING' &&
        bill?.lineItems?.some(
            item =>
            item?.billableService?.toLowerCase() === concept?.toLowerCase() &&
            item?.paymentStatus === 'PENDING'
        )
        );
    })
    .map((order, idx) => {
        const concept = order?.concept?.display;
        const patientId = order?.patient?.uuid;
        const matchingBill = bills.find(bill =>
        bill?.status === 'PENDING' &&
        bill?.lineItems?.some(
            item =>
            item?.billableService?.toLowerCase() === concept?.toLowerCase() &&
            item?.paymentStatus === 'PENDING'
        )
        );

        return {
        id: order.uuid || `${idx}`,
        orderNumber: order?.orderNumber || '--',
        orderDate: order?.dateActivated ? formatDate(parseDate(order.dateActivated)) : '--',
        testOrdered: concept || '--',
        paymentStatus: matchingBill ? t('pending', 'Pending') : t('paid', 'Paid'),
        matchingBill,
        patientUuid: patientId,
        };
    }) || [];
return (
    <ComposedModal open={open} onClose={onClose} size="lg">
    <ModalHeader
        title={`${t('procedurePaymentStatus', 'Procedure Payment Status For: ')} ${
        orders?.[0]?.patient?.person?.display || '--'
        }`}
    />
    <ModalBody>
        {rows.length > 0 ? (
        <DataTable rows={rows} headers={headers}>
            {({ rows, headers, getHeaderProps, getRowProps }) => (
            <table className={styles.paymentTable}>
                <thead>
                <tr>
                    {headers.map(header => (
                    <th key={header.key} {...getHeaderProps({ header })}>
                        {header.header}
                    </th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {rows.map(row => (
                    <tr key={row.id} {...getRowProps({ row })}>
                    {row.cells.map(cell => (
                        <td key={cell.id}>{cell.value}</td>
                    ))}
                    </tr>
                ))}
                </tbody>
            </table>
            )}
        </DataTable>
        ) : (
        <p>{t('noProcedures', 'There are no procedure orders')}</p>
        )}
    </ModalBody>

    {rows.length > 0 && (
        <ModalFooter>
        <Button kind="secondary" onClick={onClose}>
            {t('close', 'Close')}
        </Button>
        <Button
            kind="danger"
            onClick={() =>
            navigate({
                to: `${openmrsSpaBase}billing/patient/${rows[0].patientUuid}/${rows[0].matchingBill.uuid}`,
            })
            }
        >
            {t('proceedToPayment', 'Proceed to Payment')}
        </Button>
        </ModalFooter>
    )}
    </ComposedModal>
);
};

export default PaymentStatusModal;