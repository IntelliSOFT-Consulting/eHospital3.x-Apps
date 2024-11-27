import React, {useState} from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  InlineLoading,
  ModalBody,
  ModalFooter,
  Heading,
  StructuredListBody,
  StructuredListCell,
  StructuredListHead,
  StructuredListRow,
  StructuredListWrapper,
  ComposedModal
} from '@carbon/react';
import { useBills } from '../billing.resource';
import { convertToCurrency } from '../helpers';
import styles from './require-payment.scss';
import { BillingConfig } from '../config-schema';
import { navigate, useConfig } from '@openmrs/esm-framework';

type RequirePaymentModalProps = {
  closeModal: () => void;
  patientUuid: string;
};

const RequirePaymentModal: React.FC<RequirePaymentModalProps> = ({ closeModal, patientUuid }) => {
  const { t } = useTranslation();
  const { defaultCurrency } = useConfig();
  const { bills, isLoading, error } = useBills(patientUuid);
  const [showModal, setShowModal] = useState({ loadingModal: true, billingModal: true });
  const { enforceBillPayment } = useConfig<BillingConfig>();
  const lineItems = bills.filter((bill) => bill?.status !== 'PAID').flatMap((bill) => bill?.lineItems);

  const closeButtonText = enforceBillPayment
  ? t('navigateBack', 'Navigate back')
  : t('proceedToCare', 'Proceed to care');

const handleCloseModal = () => {
  enforceBillPayment
    ? navigate({ to: `\${openmrsSpaBase}/home` })
    : setShowModal((prevState) => ({ ...prevState, billingModal: false }));
};

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
                    <StructuredListCell>{lineItem.quantity}</StructuredListCell>
                    <StructuredListCell>{convertToCurrency(lineItem.price)}</StructuredListCell>
                    <StructuredListCell>{convertToCurrency(lineItem.quantity * lineItem.price)}</StructuredListCell>
                  </StructuredListRow>
                );
              })}
            </StructuredListBody>
          </StructuredListWrapper>
          {!enforceBillPayment && (
            <p className={styles.providerMessage}>
              {t(
                'providerMessage',
                'By clicking Proceed to care, you acknowledge that you have advised the patient to settle the bill.',
              )}
            </p>
          )}
        </ModalBody>
      )}
      <ModalFooter>
        <Button kind="secondary" onClick={() => navigate({ to: `\${openmrsSpaBase}/home` })}>
          {t('cancel', 'Cancel')}
        </Button>
        <Button kind="danger" onClick={handleCloseModal}>
          {closeButtonText}
        </Button>
      </ModalFooter>
    </ComposedModal>
  );
};

export default RequirePaymentModal;
