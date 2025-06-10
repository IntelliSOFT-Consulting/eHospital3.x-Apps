import React, { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  InlineLoading,
  ModalBody,
  ModalFooter,
  ModalHeader,
  StructuredListBody,
  StructuredListCell,
  StructuredListHead,
  StructuredListRow,
  StructuredListWrapper,
} from '@carbon/react';
import { useBills } from '../billing.resource';
import { convertToCurrency } from '../helpers';
import styles from './require-payment.scss';
import { navigate, useConfig } from '@openmrs/esm-framework';
import { ComposedModal } from '@carbon/react';
import { Heading } from '@carbon/react';
import { BillingConfig } from '../config-schema';
import { getPatientUuidFromStore } from '@openmrs/esm-patient-common-lib';
import dayjs from 'dayjs';

type RequirePaymentModalProps = {
  closeModal?: () => void;
};

const RequirePaymentModal: React.FC<RequirePaymentModalProps> = () => {
  const { t } = useTranslation();
  const { defaultCurrency } = useConfig();
  const patientUuid = getPatientUuidFromStore();

  const startDate = useMemo(() => dayjs().subtract(1, 'year').toDate(), []);
  const today = useMemo(() => dayjs().toDate(), []);

  const { bills, isLoading, error } = useBills(
    patientUuid,
    '',
    startDate,
    today,
  );

  const [showModal, setShowModal] = useState({ loadingModal: true, billingModal: false });
  const { enforceBillPayment } = useConfig<BillingConfig>();
  const openmrsSpaBase = window['getOpenmrsSpaBase']();

  // Filter bills to only include unpaid ones and non-exempted line items
  // Note: `bills` from `useBills` already apply `mapBillProperties` which simplifies things.
  // The `bill.status !== 'PAID'` check should be enough for filtering
  const unpaidBills = useMemo(() => {
    return bills.filter((bill) => bill.status !== 'PAID');
  }, [bills]);

  const unpaidBillUuid = unpaidBills.length > 0 ? unpaidBills[0].uuid : null;

  const closeButtonText = enforceBillPayment
    ? t('navigateBack', 'Proceed to Payment')
    : t('proceedToCare', 'Proceed to care');

  const handleProceedToPay = () => {
    if (unpaidBillUuid) {
      navigate({ to: `${openmrsSpaBase}billing/patient/${patientUuid}/${unpaidBillUuid}` });
    } else {
      navigate({ to: `${openmrsSpaBase}/home` });
    }
  };

  const lineItems = useMemo(() => {
    return unpaidBills
      .flatMap((bill) => bill.lineItems)
      .filter((lineItem) => lineItem.paymentStatus !== 'EXEMPTED' && !lineItem.voided);
  }, [unpaidBills]);

  useEffect(() => {
    if (!isLoading) {
      if (lineItems.length > 0) {
        setShowModal({ loadingModal: false, billingModal: true });
      } else {
        setShowModal({ loadingModal: false, billingModal: false });
      }
    }
  }, [isLoading, lineItems]);

  return (
    <ComposedModal preventCloseOnClickOutside open={showModal.billingModal}>
      {isLoading ? (
        <ModalBody>
          <Heading className={styles.modalTitle}>{t('billingStatus', 'Billing status')}</Heading>
          <InlineLoading
            status="active"
            iconDescription="Loading"
            description={t('patientBilling', 'Verifying patient bills')}
          />
        </ModalBody>
      ) : (
        <ModalBody>
          <Heading className={styles.modalTitle}>{t('patientBillingAlert', 'Patient Billing Alert')}</Heading>
          <p className={styles.bodyShort02}>
            {t('billPaymentRequiredMessage', 'The current patient has pending bill. Advice patient to settle bill.')}
          </p>
          <StructuredListWrapper isCondensed>
            <StructuredListHead>
              <StructuredListRow head>
                <StructuredListCell head>{t('item', 'Item')}</StructuredListCell>
                <StructuredListCell head>{t('quantity', 'Quantity')}</StructuredListCell>
                <StructuredListCell head>{t('unitPrice', 'Unit price')}</StructuredListCell>
                <StructuredListCell head>{t('total', 'Total')}</StructuredListCell>
              </StructuredListRow>
            </StructuredListHead>
            <StructuredListBody>
              {lineItems.map((lineItem, index) => {
                return (
                  <StructuredListRow key={lineItem.uuid || index}>
                    <StructuredListCell>{(lineItem.billableService)}</StructuredListCell>
                    <StructuredListCell>{lineItem.quantity}</StructuredListCell>
                    <StructuredListCell>{convertToCurrency(lineItem.price, defaultCurrency)}</StructuredListCell>
                    <StructuredListCell>{convertToCurrency(lineItem.quantity * lineItem.price, defaultCurrency)}</StructuredListCell>
                  </StructuredListRow>
                );
              })}
            </StructuredListBody>
          </StructuredListWrapper>
          {/* {!enforceBillPayment && (
            <p className={styles.providerMessage}>
              {t(
                'providerMessage',
                'By clicking Proceed to care, you acknowledge that you have advised the patient to settle the bill.',
              )}
            </p>
          )} */}
        </ModalBody>
      )}
      <ModalFooter>
        <Button kind="secondary" onClick={() => navigate({ to: `\${openmrsSpaBase}/home` })}>
          {t('cancel', 'Cancel')}
        </Button>
        <Button kind="danger" onClick={handleProceedToPay} disabled={!unpaidBillUuid && enforceBillPayment}>
          {closeButtonText}
        </Button>
      </ModalFooter>
    </ComposedModal>
  );
};

export default RequirePaymentModal;