import React, { useState, useEffect } from 'react';
import { DatePicker, DatePickerInput } from '@carbon/react';
import { useTranslation } from 'react-i18next';
import styles from '../payment-history.scss';
import { usePaymentFilterContext } from '../usePaymentFilterContext';

export const TableToolBarDateRangePicker = () => {
  const { t } = useTranslation();
  const { dateRange, setDateRange } = usePaymentFilterContext();

  // Local state to handle date selection
  const [selectedDates, setSelectedDates] = useState<[Date | null, Date | null]>([null, null]);

  useEffect(() => {
    if (selectedDates[0] && selectedDates[1]) {
      console.log('Setting date range:', selectedDates);
      setDateRange(selectedDates as [Date, Date]);
    }
  }, [selectedDates, setDateRange]);

  const handleDateChange = (dates: (Date | null)[]) => {
    console.log('Date change:', dates); // Debugging log
    setSelectedDates(dates as [Date | null, Date | null]);
  };

  const handleDatePickerClose = () => {
    console.log('DatePicker closed');
  };

  return (
    <DatePicker
      maxDate={new Date()}
      datePickerType="range"
      className={styles.dateRangePicker}
      value={selectedDates}
      onChange={handleDateChange}
      onClose={handleDatePickerClose}
    >
      <DatePickerInput
        id="date-picker-input-id-start"
        placeholder="mm/dd/yyyy"
        labelText={t('startDate', 'Start date')}
        size="md"
      />
      <DatePickerInput
        id="date-picker-input-id-finish"
        placeholder="mm/dd/yyyy"
        labelText={t('endDate', 'End date')}
        size="md"
      />
    </DatePicker>
  );
};
