import React, { useState } from 'react';
import { DatePicker, DatePickerInput } from '@carbon/react';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';

interface BillsDateRangePickerProps {
  dates: [Date, Date];
  onChange: (dates: [Date, Date]) => void;
}

export const BillsDateRangePicker: React.FC<BillsDateRangePickerProps> = ({ dates, onChange }) => {
  const { t } = useTranslation();

  const handleDateChange = (range: Date[]) => {
    if (range?.[0] && range?.[1]) {
      onChange([dayjs(range[0]).startOf('day').toDate(), dayjs(range[1]).endOf('day').toDate()]);
    }
  };

  return (
    <DatePicker
      maxDate={new Date()}
      datePickerType="range"
      value={dates.map((date) => dayjs(date).format('DD/MM/YYYY'))}
      onChange={handleDateChange}>
      <DatePickerInput
        id="date-picker-input-id-start"
        placeholder="dd/mm/yyyy"
        labelText={t('startDate', 'Start date')}
        size="md"
      />
      <DatePickerInput
        id="date-picker-input-id-finish"
        placeholder="dd/mm/yyyy"
        labelText={t('endDate', 'End date')}
        size="md"
      />
    </DatePicker>
  );
};
