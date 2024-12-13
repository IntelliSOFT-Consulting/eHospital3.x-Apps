import React from "react";
import { useTranslation } from "react-i18next";
import BillingHeader from "../../billing-header/billing-header.component";
import ClinicalCharges from "../clinical-charges.component";
import LeftPanel from "../../left-panel/left-panel.component";
import styles from './dashboard.scss'


export const ChargeItemsDashboard = () => {
    const { t } = useTranslation();
  
    return (
      <main className={styles.container}>
        <LeftPanel />
        <BillingHeader title={t('chargeItems', 'Charge Items')} />
        <main className={styles.servicesTableContainer}>
          <ClinicalCharges />
        </main>
      </main>
    );
  };