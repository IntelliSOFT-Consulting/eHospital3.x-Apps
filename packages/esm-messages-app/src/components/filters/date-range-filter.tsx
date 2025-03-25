import { DatePicker, DatePickerInput, Button } from "@carbon/react";
import React from "react";
import { useTranslation } from "react-i18next";
import { useDateFilterContext } from "./useFilterContext";
import styles from "./date-range-filter.scss";

export const DateRangePicker: React.FC = () => {
  const { t } = useTranslation();
  const { dateRange, setDateRange, applyDateFilter } = useDateFilterContext();

  const handleDateRangeChange = ([start, end]: Array<Date>) => {
    if (start && end) {
      setDateRange([start, end]);
    }
  };

  return (
    <div className={styles.parent}>
      <DatePicker
        maxDate={new Date()}
        datePickerType="range"
        value={[...dateRange]}
        onChange={handleDateRangeChange}
        className={styles.dateRangePicker}
      >
        <DatePickerInput
          id="date-picker-input-id-start"
          placeholder="mm/dd/yyyy"
          labelText={t("startDate", "Start date")}
        />
        <DatePickerInput
          id="date-picker-input-id-finish"
          placeholder="mm/dd/yyyy"
          labelText={t("endDate", "End date")}
        />
      </DatePicker>
      <Button onClick={applyDateFilter}>Submit</Button>
    </div>
  );
};
