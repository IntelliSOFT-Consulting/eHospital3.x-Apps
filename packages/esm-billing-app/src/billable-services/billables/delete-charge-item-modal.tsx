import React from 'react';
import { ModalBody, ModalHeader, ModalFooter, Button } from '@carbon/react';
import { useTranslation } from 'react-i18next';
import { showSnackbar } from '@openmrs/esm-framework';
import { deleteChargeItem } from '../billable-service.resource';
import styles from './delete-charge-item-modal.scss';

type DeleteChargeItemModalProps = {
  closeModal: () => void;
  selectedChargeItem: any;
  mutate: () => void;
};

const DeleteChargeItemModal: React.FC<DeleteChargeItemModalProps> = ({ selectedChargeItem, closeModal, mutate }) => {
  const { t } = useTranslation();

  const handleDelete = async () => {
    try {
      await deleteChargeItem(selectedChargeItem.uuid);
      mutate();
      showSnackbar({
        title: t('chargeItemDeleted', 'Charge Item deleted'),
        subtitle: t('chargeItemDeletedSubtitle', 'The charge item has been deleted'),
        kind: 'success',
        isLowContrast: true,
        timeoutInMs: 5000,
        autoClose: true,
      });
      closeModal();
    } catch (error) {
      showSnackbar({
        title: t('chargeItemDeletedError', 'Error deleting charge item'),
        subtitle: t('chargeItemDeletedErrorSubtitle', 'An error occurred while deleting the charge item'),
        kind: 'error',
        isLowContrast: true,
        timeoutInMs: 5000,
        autoClose: true,
      });
    }
  };

  return (
    <>
      <ModalHeader onClose={closeModal} closeModal={closeModal} className={styles.modalHeaderLabel}>
        {t('deleteChargeItem', 'Delete Charge Item')}
      </ModalHeader>
      <ModalBody className={styles.modalHeaderHeading}>
        {t('deleteChargeItemDescription', 'Are you sure you want to delete this charge item? Proceed cautiously.')}
      </ModalBody>
      <ModalFooter>
        <Button kind="secondary" onClick={closeModal}>
          {t('cancel', 'Cancel')}
        </Button>
        <Button kind="danger" onClick={handleDelete}>
          {t('delete', 'Delete')}
        </Button>
      </ModalFooter>
    </>
  );
};
export default DeleteChargeItemModal;
