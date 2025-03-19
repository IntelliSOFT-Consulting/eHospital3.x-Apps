import { DatePicker, DatePickerInput } from "@carbon/react";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

export const DateRangePicker = ({
  onDateChange,
}: {
  onDateChange: (dates: [Date, Date]) => void;
}) => {
  const { t } = useTranslation();
  const [dateRange, setDateRange] = useState<[Date, Date]>([
    new Date(),
    new Date(),
  ]);

  const handleDateRangeChange = (selectedDates: Date[]) => {
    if (selectedDates.length === 2) {
      setDateRange([selectedDates[0], selectedDates[1]]);
      onDateChange([selectedDates[0], selectedDates[1]]);
    }
  };

  return (
    <DatePicker
      maxDate={new Date()}
      datePickerType="range"
      value={[...dateRange]}
      onChange={handleDateRangeChange}
    >
      <DatePickerInput
        id="date-picker-input-id-start"
        placeholder="mm/dd/yyyy"
        labelText={t("startDate", "Start date")}
        size="md"
      />
      <DatePickerInput
        id="date-picker-input-id-finish"
        placeholder="mm/dd/yyyy"
        labelText={t("endDate", "End date")}
        size="md"
      />
    </DatePicker>
  );
};
