import React, {useEffect, useRef, useState} from "react";
import styles from "./home-dashboard.scss";
import {useTranslation} from "react-i18next";
import PatientQueueIllustration from "./patient-queue-illustration.component";
import MetricsCard from "./dashboard-card/dashboard-card.component";
import {
  DatePicker,
  DatePickerInput,
  Tile,
  SkeletonPlaceholder,
  DataTableSkeleton,
  Link,
  Tab,
  TabList,
  IconSwitch, ContentSwitcher, TextInput, RadioButton, TableToolbarSearch, ExpandableSearch,
} from "@carbon/react";
import {ChartLineSmooth, Table as TableIcon} from "@carbon/react/icons";
import {useOPDPatientList} from "../hooks/useOPDPatientList";
import ReportsTableComponent from "../components/reports-table.component";
import ReportsGraphicalChartComponent from "../components/reports-graphical-chart.component";
import {getPaddedTodayDateRange} from "../helpers/dateOps";

type PatientVisistsReportHomeProps = {
  patientUuid?: string;
};

const PatientVisitsReportHome: React.FC<PatientVisistsReportHomeProps> = () => {
  const {t} = useTranslation();
  const [searchString, setSearchString] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [chartActive, setChartActive] = useState(false);
  const [listActive, setListActive] = useState(true);
  const [view, setView] = useState("yearly");
  const datePickerRef = useRef(null)


  const {
    isLoading,
    data,
    setDateRange,
    dateRange,
    totalPatients,
    totalOpdPatients,
    summary
  } = useOPDPatientList();

  const tableData = [
    {
      header: t('name', 'Name'),
      key: 'fullName',
    },
    {
      header: t('age', 'Age'),
      key: 'age',
    },
    {
      header: t('gender', 'Gender'),
      key: 'gender',
    },
    {
      header: t('opdNumber', 'OPD Number'),
      key: 'opdNumber',
    },
    {
      header: t('id', 'ID'),
      key: 'openmrsID',
    },
    {
      header: t('diagnosis', 'Diagnosis'),
      key: 'diagnosis',
    }
  ]

  const filteredData = data?.filter((patient) => {
    return patient.diagnosis?.toLowerCase().includes(searchString.toLowerCase())
  })

  const rowData = filteredData?.map((patient) => {
    return {
      id: patient.openmrsID,
      fullName: () => (
        <Link
          href={`${window.getOpenmrsSpaBase()}patient/${
            patient.uuid
          }/chart/Patient%20Summary`}
        >
          {patient.fullName}
        </Link>
      ),
      openmrsID: patient.openmrsID,
      gender: patient.gender,
      age: patient.age,
      opdNumber: patient.opdNumber,
      diagnosis: patient.diagnosis
    }
  }) || [];

  const paginatedData = rowData?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const activateChart = () => {
    setChartActive(true);
    setListActive(false);
  }

  const activateList = () => {
    setChartActive(false);
    setListActive(true);
  }


  const [chartData, setChartData] = useState([]);

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
    } else if (view === "monthly") {
      updatedChartData = Object.keys(summary.groupMonth || {}).map(week => ({
        group: formatWeekLabel(week),
        value: summary.groupMonth[week] || 0
      }));
    }
    setChartData(updatedChartData)
  }, [summary, dateRange, view]);

  useEffect(() => {
    console.log("ref", datePickerRef.current)
    if (datePickerRef?.current){
      const inputs = datePickerRef.current.querySelectorAll("input");
      inputs.forEach(input => input.focus());
    }
      datePickerRef.current.focus();

  }, [datePickerRef]);

  return (
    <div className={styles.container}>
      {isLoading ? (
        <div
          style={{
            width: "100%"
          }}
        >
          <div className={styles.header} data-testid="patient-queue-header">
            <div className={styles["left-justified-items"]}>
              <PatientQueueIllustration/>
              <div className={styles["page-labels"]}>
                <p className={styles.title}>{t("outPatient", "Out Patient")}</p>
              </div>
            </div>
          </div>
          <div
            className={styles.cardContainer}
            data-testid="registered-patients"
          >
            <Tile className={styles.tileContainer}>
              <SkeletonPlaceholder/>
            </Tile>
          </div>
          <br/>
          <DataTableSkeleton columns={tableData?.length} rows={5}/>
        </div>
      ) : (
        <>
          <div className={styles.header} data-testid="patient-queue-header">
            <div className={styles["left-justified-items"]}>
              <PatientQueueIllustration/>
              <div className={styles.pageLabels}>
                <p className={styles.title}>{t("outPatient", "Out Patient")}</p>
              </div>
            </div>
          </div>


          <div className={styles.homeContainer}>
            <div className={styles.cardContainerParent} data-testid="clinic-metrics">
              <MetricsCard
                className="metricsCard"
                label={t("total", "Total")}
                value={totalOpdPatients ? totalOpdPatients.toString() : 0}
                headerLabel={t("totalOPDVisits", "Total OPD Visits")}
              />
              <MetricsCard
                className="metricsCard"
                label={t("total", "Total")}
                value={totalPatients ? totalPatients.toString() : 0}
                headerLabel={t("totalOPDVisitsForPeriod", "Total OPD Visits for Period")}
              />
            </div>

            <div className={styles.departmentTabs}>
              <TabList contained>
                <Tab>Consultation</Tab>
                <Tab>Dental</Tab>
                <Tab>Ultra Sound</Tab>
                <Tab>Pharmacy</Tab>
                <Tab>Laboratory</Tab>
              </TabList>
            </div>

            <div className={styles.contentContainer}>
              {/*......................FILTERS..................................*/}
              <div className={styles.filterWrapper}>
                {listActive ? <ExpandableSearch
                  size="sm"
                  className={styles.searchField}
                  value={searchString}
                  onChange={(e) => setSearchString(e.target.value)}
                  placeholder={t("searchByDiagnosis", "Search by Diagnosis")}
                /> : (
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
                  </div>
                )}

                <div ref={datePickerRef} className={styles.filterDatePicker}>
                  {dateRange.start && (
                    <DatePicker
                      onChange={(value) => {
                        setDateRange({start: value[0], end: value[1]})
                      }}
                      value={[dateRange.start, dateRange.end]}
                      datePickerType="range"
                      dateFormat="d/m/Y"
                    >
                      <DatePickerInput
                        id="date-picker-input-id-start"
                        placeholder="dd/mm/yyyy"
                        labelText="Start date"
                        size="sm"
                      />
                      <DatePickerInput
                        id="date-picker-input-id-finish"
                        placeholder="dd/mm/yyyy"
                        labelText="End date"
                        size="sm"
                      />
                    </DatePicker>
                  )}

                </div>

                <ContentSwitcher size="sm" className={styles.contentSwitcher}>
                  <IconSwitch name="tableView" text="Table view" onClick={activateList}>
                    <TableIcon size={16}/>
                  </IconSwitch>
                  <IconSwitch name="chartView" text="Chart view" onClick={activateChart}>
                    <ChartLineSmooth size={16}/>
                  </IconSwitch>
                </ContentSwitcher>
              </div>
              {listActive ? (
                <ReportsTableComponent
                  dateRange={dateRange}
                  tableData={tableData}
                  paginatedData={paginatedData}
                  rowData={rowData}
                />
              ) : (
                <ReportsGraphicalChartComponent
                  chartData={chartData}
                />
              )}
            </div>

          </div>
        </>
      )}
    </div>
  );
};

export default PatientVisitsReportHome;
