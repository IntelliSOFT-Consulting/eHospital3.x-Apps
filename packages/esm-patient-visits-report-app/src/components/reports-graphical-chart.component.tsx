import React, { useEffect, useState } from "react";
import { SimpleBarChart } from "@carbon/charts-react";
import '@carbon/charts-react/styles.css';
import { ScaleTypes } from "@carbon/charts-react";
import { useTranslation } from "react-i18next";
import styles from "../home-dashboard/home-dashboard.scss";

type PatientChartsProps = {
  chartData: any
};

const ReportsGraphicalChartComponent: React.FC<PatientChartsProps> = ({ chartData }) => {
  const {t} = useTranslation();


  const options = {
    axes: {
      left: {
        mapsTo: 'value',
        title: t("numberOfPatients", "No. of Patients"),
      },
      bottom: {
        mapsTo: 'group',
        scaleType: ScaleTypes.LABELS,
        title: t("period", "Period"),
      }
    },
    height: '400px',
  }

  return (
    <div className={styles.chartContainer}>
      <SimpleBarChart
        data={chartData}
        options={options}
      />
    </div>
  );
}

export default ReportsGraphicalChartComponent;
