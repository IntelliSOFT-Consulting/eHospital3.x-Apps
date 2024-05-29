import React from "react";
import styles from "./home-dashboard.scss";
import { useTranslation } from "react-i18next";
import { ExtensionSlot } from "@openmrs/esm-framework";
import { Home } from "@carbon/react/icons";

type HomeDashboardProps = { customIconColor?: string };

const HomeDashboard: React.FC<HomeDashboardProps> = (customIconColor) => {
  const { t } = useTranslation();

  return (
    <div className={styles.homeContainer}>
      <section className={styles.header}>
        <Home className={styles.icon} />
        <div className={styles.titleContainer}>
          <p className={styles.title}>{t("reports", "Reports")}</p>
          <p className={styles.subTitle}>{t("dashboard", "Dashboard")}</p>
        </div>
      </section>

      <section className="appointments">
        <ExtensionSlot name="hiv-art-dashboard-slot" />
      </section>
    </div>
  );
};

export default HomeDashboard;
