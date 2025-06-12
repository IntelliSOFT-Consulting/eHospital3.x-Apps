import React, { useState } from 'react';
import MetricsCards from './metrics-cards/metrics-cards.component';
import BillsTable from './bills-table/bills-table.component';
import styles from './billing-overview-dashboard.scss';
import dayjs from 'dayjs';

const BillingOverviewDashboard = () => {
  const [dates, setDates] = useState<[Date, Date]>([dayjs().startOf('day').toDate(), dayjs().endOf('day').toDate()]);
  return (
    <>
      <MetricsCards startDate={dates[0]} endDate={dates[1]} />
      <section className={styles.billsTableContainer}>
        <BillsTable dates={dates} onDateChange={setDates} />
      </section>
    </>
  );
};

export default BillingOverviewDashboard;
