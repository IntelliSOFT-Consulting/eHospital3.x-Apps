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

  const handleDateChange = (range: Array<Date>) => {
    if (range.length === 2 && range[0] && range[1]) {
      const selectedStart = dayjs(range[0]).startOf('day').toDate();
      const selectedEnd = dayjs(range[1]).endOf('day').toDate();
      onChange([selectedStart, selectedEnd]);
    }
  };

  return (
    <DatePicker
      maxDate={new Date()}
      datePickerType="range"
      value={dates.map((date) => dayjs(date).format('MM/DD/YYYY'))}
      onChange={handleDateChange}>
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
