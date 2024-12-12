import { Checkbox, SkeletonIcon, usePrefix } from '@carbon/react';
import React, { ChangeEvent } from 'react';
import { MappedBill } from '../../types';
import styles from './payment-history.scss';
import { useServiceTypes } from '../billable-service.resource';

export const ServiceTypeFilter = ({
  selectedServiceTypeCheckboxes,
  applyServiceTypeFilter,
}: {
  selectedServiceTypeCheckboxes: Array<string>;
  bills: Array<MappedBill>;
  applyServiceTypeFilter: (filters: Array<string>) => void;
}) => {
  const { serviceTypes, isLoading } = useServiceTypes();
  const prefix = usePrefix();

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const checkboxId = e.target.id;
    const isChecked = e.target.checked;

    const checkboxValue: HTMLSpanElement | null = document.querySelector(`label[for="${checkboxId}"]`);
    const serviceTypeUUID = serviceTypes.find((s) => s.display === checkboxValue.innerText).uuid;

    if (isChecked && checkboxValue) {
      applyServiceTypeFilter([...selectedServiceTypeCheckboxes, serviceTypeUUID]);
    } else {
      applyServiceTypeFilter(selectedServiceTypeCheckboxes.filter((item) => item !== serviceTypeUUID));
    }
  };

  if (isLoading) {
    return <SkeletonIcon className={styles.skeletonIcon} />;
  }

  return (
    <div className={styles.checkBoxWrapper}>
      <fieldset className={`${prefix}--fieldset`}>
        <legend className={`${prefix}--label`}>Service type</legend>
        {serviceTypes.length === 0 && <p className={styles.noServiceTypes}>No Service Types In Bills Range</p>}
        {serviceTypes.map((type) => (
          <Checkbox
            labelText={type.display}
            id={`checkbox-${type.display}`}
            onChange={handleCheckboxChange}
            checked={selectedServiceTypeCheckboxes.includes(type.uuid)}
          />
        ))}
      </fieldset>
    </div>
  );
};
