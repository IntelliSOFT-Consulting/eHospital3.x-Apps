import React from 'react';
import { Filter } from './filter.component';
import { TimesheetsFilter } from './timesheets-filter.component';
import { TableToolBarDateRangePicker } from './table-toolbar-date-range';
import styles from './filter-dashboard.scss';

export const FilterDashboard = () => {
  return (
    <div className={styles.filterDashboard}>
      <div className={styles.filterContainer}>
        <TableToolBarDateRangePicker />
        <Filter />
        <TimesheetsFilter />
      </div>
    </div>
  );
};
