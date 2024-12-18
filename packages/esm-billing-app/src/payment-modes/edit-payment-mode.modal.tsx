import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Form, Loading, ModalBody, ModalFooter, ModalHeader, TextInput } from '@carbon/react';
import { restBaseUrl, showSnackbar, useLayoutType } from '@openmrs/esm-framework';
import { Controller, useForm } from 'react-hook-form';
import styles from './payment-mode.workspace.scss';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { createPaymentMode, handleMutation } from './payment-mode.resource';
import { PaymentMode } from '../types';
import usePaymentModeFormSchema from './usePaymentModeFormSchema';
import PaymentModeAttributeFields from './payment-attributes/payment-mode-attributes.component';
import { Add } from '@carbon/react/icons';

type EditPaymentModeModalProps = {
    closeModal: () => void;
    initialPaymentMode?: PaymentMode;
  };

const EditPaymentMode : React.FC<EditPaymentModeModalProps> = ({ closeModal, initialPaymentMode = {} as PaymentMode, }) => {
  const { t } = useTranslation();
  const { paymentModeFormSchema } = usePaymentModeFormSchema();
  type PaymentModeFormSchema = z.infer<typeof paymentModeFormSchema>;
  const formDefaultValues = Object.keys(initialPaymentMode).length > 0 ? initialPaymentMode : {};

  const formMethods = useForm<PaymentModeFormSchema>({
    resolver: zodResolver(paymentModeFormSchema),
    mode: 'all',
    defaultValues: formDefaultValues,
  });

  const { errors, isSubmitting } = formMethods.formState;

  // field array
  // const {
  //   fields: attributeTypeFields,
  //   append: appendAttributeType,
  //   remove: removeAttributeType,
  // } = useFieldArray({
  //   control: formMethods.control,
  //   name: 'attributeTypes',
  // });

  // const mappedAttributeTypes = (attributes) => {
  //   return {
  //     name: attributes.name,
  //     description: attributes.description,
  //     retired: attributes.retired,
  //     attributeOrder: attributes?.attributeOrder ?? 0,
  //     format: attributes?.format ?? '',
  //     foreignKey: attributes?.foreignKey ?? null,
  //     regExp: attributes?.regExp ?? '',
  //     required: attributes.required,
  //   };
  // };

  const onSubmit = async (data: PaymentModeFormSchema) => {
    const payload: Partial<PaymentMode> = {
      name: data.name,
      description: data.description,
    };

    try {
      const response = await createPaymentMode(payload, initialPaymentMode?.uuid ?? '');
      if (response.ok) {
        showSnackbar({
          title: t('paymentModeUpdated', 'Payment mode updated successfully'),
          subtitle: t('paymentModeUpdatedSubtitle', 'The payment mode has been updated successfully'),
          kind: 'success',
          isLowContrast: true,
        });
        closeModal();
        handleMutation(`${restBaseUrl}/billing/paymentMode?v=full`);
      }
    } catch (error) {
      const errorObject = error?.responseBody?.error;
      const errorMessage = errorObject?.message ?? 'An error occurred while creating the payment mode';
      showSnackbar({
        title: t('paymentModeUpdateFailed', 'Payment mode updating failed'),
        subtitle: t(
          'paymentModeCreationFailedSubtitle',
          'An error occurred while updating the payment mode {{errorMessage}}',
          { errorMessage },
        ),
        kind: 'error',
        isLowContrast: true,
      });
    }
  };

  const handleError = (error) => {
    showSnackbar({
      title: t('paymentModeUpdateFailed', 'Payment mode updating failed'),
      subtitle: t(
        'paymentModeCreationFailedSubtitle',
        'An error occurred while updating the payment mode {{errorMessage}}',
        { errorMessage: JSON.stringify(error, null, 2) },
      ),
      kind: 'error',
      isLowContrast: true,
    });
  };

  return (
    <Form>
      <ModalHeader closeModal={closeModal}>Edit Payment Mode</ModalHeader>
      <ModalBody>
        <Controller
          name="name"
          control={formMethods.control}
          render={({ field }) => (
            <TextInput
              {...field}
              id="name"
              type="text"
              labelText={t('paymentModeName', 'Payment mode name')}
              placeholder={t('paymentModeNamePlaceholder', 'Enter payment mode name')}
              invalid={!!errors.name}
              invalidText={errors.name?.message}
            />
          )}
        />
        <Controller
          name="description"
          control={formMethods.control}
          render={({ field }) => (
            <TextInput
              {...field}
              id="description"
              type="text"
              labelText={t('paymentModeDescription', 'Payment mode description')}
              placeholder={t('paymentModeDescriptionPlaceholder', 'Enter payment mode description')}
              invalid={!!errors.description}
              invalidText={errors.description?.message}
            />
          )}
        />
      </ModalBody>
      <ModalFooter>
        <Button style={{ maxWidth: '50%' }} kind="secondary" onClick={closeModal}>
          {t('cancel', 'Cancel')}
        </Button>
        <Button
          disabled={isSubmitting || Object.keys(errors).length > 0}
          style={{ maxWidth: '50%' }}
          kind="primary"
          type="submit"
          onClick={formMethods.handleSubmit(onSubmit, handleError)}>
          {isSubmitting ? (
            <>
              <Loading className={styles.button_spinner} withOverlay={false} small />
              {t('updating', 'Updating')}
            </>
          ) : (
            t('update', 'Update')
          )}
        </Button>
      </ModalFooter>
    </Form>
  );
};

export default EditPaymentMode;
