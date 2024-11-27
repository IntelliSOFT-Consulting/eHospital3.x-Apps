import React, { useEffect, useState } from 'react';
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
import { getPatientUuidFromUrl } from '@openmrs/esm-patient-common-lib';

type RequirePaymentModalProps = {
  closeModal: () => void;
  patientUuid: string;
};

const RequirePaymentModal: React.FC<RequirePaymentModalProps> = () => {
  const { t } = useTranslation();
  const { defaultCurrency } = useConfig();
  const patientUuid = getPatientUuidFromUrl(); 
  const { bills, isLoading, error } = useBills(patientUuid);
  const [showModal, setShowModal] = useState({ loadingModal: true, billingModal: false });
  const { enforceBillPayment } = useConfig<BillingConfig>();
  const openmrsSpaBase = window['getOpenmrsSpaBase']();

  const unpaidBills = bills.filter((bill) => bill.status !== 'PAID');
  const unpaidBillUuid = unpaidBills.length > 0 ? unpaidBills[0].uuid : null;

  const closeButtonText = enforceBillPayment
    ? t('navigateBack', 'Proceed to Payment')
    : t('proceedToCare', 'Proceed to care');

    const handleProceedToPay = () => {
      navigate({ to: `${openmrsSpaBase}billing/patient/${patientUuid}/${unpaidBillUuid}` });
    };

    const lineItems = bills
    .filter((bill) => bill.status !== 'PAID')
    .flatMap((bill) => bill.lineItems)
    .filter((lineItem) => lineItem.paymentStatus !== 'EXEMPTED' && !lineItem.voided);

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
              {lineItems.map((lineItem) => {
                return (
                  <StructuredListRow>
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
        <Button kind="danger" onClick={handleProceedToPay}>
          {closeButtonText}
        </Button>
      </ModalFooter>
    </ComposedModal>
  );
};

export default RequirePaymentModal;
