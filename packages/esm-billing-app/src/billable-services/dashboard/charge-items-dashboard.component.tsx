import React from "react";
import { useTranslation } from "react-i18next";
import BillingHeader from "../../billing-header/billing-header.component";
import ClinicalCharges from "../clinical-charges.component";
import styles from './dashboard.scss'
import LeftPanel from "../../left-panel/left-panel.component";

export const ChargeItemsDashboard = () => {
    const { t } = useTranslation();
  
    return (
      <>
      <LeftPanel />
      <main className={styles.container}>
        <BillingHeader title={t('chargeItems', 'Charge Items')} />
        <main className={styles.servicesTableContainer}>
          <ClinicalCharges />
        </main>
      </main>
      </>
    );
  };