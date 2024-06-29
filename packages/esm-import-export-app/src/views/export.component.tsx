import React from 'react';
import styles from "./styles/index.scss"
import ImportExportIllustrationComponent from "../components/import-export-illustration.component";
import {useTranslation} from "react-i18next";

const Home: React.FC = () => {
  const {t} = useTranslation()

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <ImportExportIllustrationComponent/>
        <div className={styles.headerTextWrapper}>
          <p className={styles.headerSubText}>{t("importExport", "Import Export")}</p>
          <p className={styles.headerTitle}>{t("home", "Home")}</p>
        </div>
      </div>

    </div>
  );
};

export default Home;
