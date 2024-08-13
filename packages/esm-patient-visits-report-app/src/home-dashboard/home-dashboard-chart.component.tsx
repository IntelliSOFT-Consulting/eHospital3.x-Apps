import React, { useEffect, useState } from "react";
import { SimpleBarChart } from "@carbon/charts-react";
import '@carbon/charts-react/styles.css';
import { ScaleTypes } from "@carbon/charts-react";
import { useTranslation } from "react-i18next";
import { DatePicker, DatePickerInput, RadioButton } from "@carbon/react";
import styles from "./home-dashboard.scss";

type PatientChartsProps = {
  patientUuid?: string;
  summary: any;
  dateRange: {start: string, end: string};
  setDateRange: (range: {start: string, end: string}) => void;
  activeFilter: string;
};

const HomeDashboardChart: React.FC<PatientChartsProps> = ({ summary, dateRange, setDateRange, activeFilter }) => {
  const {t} = useTranslation();

  const [chartData, setChartData] = useState([]);
  const [view, setView] = useState("yearly");

  const months = [
    "January", 
    "February", 
    "March", 
    "April", 
    "May", 
    "June", 
    "July", 
    "August", 
    "September", 
    "October", 
    "November", 
    "December"
  ]

  const formatWeekLabel = (label: string) => {
    const [monthAbbrev, week] = label.split("_");
    const monthName = months.find(month => month.startsWith(monthAbbrev));

    return `Week ${week.slice(-1)} of ${monthAbbrev}`
  }

  useEffect(() => {
    let updatedChartData = [];

    if (view === "yearly") {
      updatedChartData = months.map(month => {
        const monthAbbrev = month.substring(0, 3);
        return {
          group: month,
          value: summary.groupYear[monthAbbrev] || 0
        }
      })
    }else if (view === "monthly") {
      updatedChartData = Object.keys(summary.groupMonth || {}).map(week => ({
        group: formatWeekLabel(week),
        value: summary.groupMonth[week] || 0
      }));
    }
    setChartData(updatedChartData)
  }, [summary, dateRange, view]);

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
      <div className={styles.filterElements}>
        <RadioButton
          id="yearly"
          labelText={t("yearly", "Yearly")}
          value="yearly"
          checked={view === "yearly"}
          onClick={() => setView("yearly")}
        />
        <RadioButton
          id="monthly"
          labelText={t("monthly", "Monthly")}
          value="monthly"
          checked={view === "monthly"}
          onClick={() => setView("monthly")}
        />
        <DatePicker
          onChange= {(value) => setDateRange({start: value[0], end: value[1]})}
          value={[dateRange.start, dateRange.end]}
          datePickerType="range"
          dateFormat="d/m/Y"
        >
          <DatePickerInput 
            id="date-picker-input-id-start"
            placeholder="dd/mm/yyyy"
            labelText={t("startDate", "Start date")}
            size="md"
          />
          <DatePickerInput 
            id="date-picker-input-id-finish"
            placeholder="dd/mm/yyyy"
            labelText={t("endDate", "End date")}
            size="md"
          />
        </DatePicker>
      </div>
      <SimpleBarChart
        data={chartData}
        options={options}
      />
    </div>
  );
}

export default HomeDashboardChart