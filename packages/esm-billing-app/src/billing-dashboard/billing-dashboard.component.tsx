import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import BillingHeader from '../billing-header/billing-header.component';
import BillingOverviewDashboard from '../billing-overview/billing-overview-dashboard';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { omrsDateFormat } from '../constants';
import SelectedDateContext from '../hooks/selectedDateContext';
import LeftPanel from '../left-panel/left-panel.component';

export function BillingDashboard() {
  const { t } = useTranslation();
  const [selectedDate, setSelectedDate] = useState<string>(dayjs().startOf('day').format(omrsDateFormat));

  let params = useParams();

  useEffect(() => {
    if (params.date) {
      setSelectedDate(dayjs(params.date).startOf('day').format(omrsDateFormat));
    }
  }, [params.date]);

  return (
    <>
      <LeftPanel />
      <SelectedDateContext.Provider value={{ selectedDate, setSelectedDate }}>
        <BillingHeader title={t('home', 'Home')} />
        <BillingOverviewDashboard />
      </SelectedDateContext.Provider>
    </>
  );
}
