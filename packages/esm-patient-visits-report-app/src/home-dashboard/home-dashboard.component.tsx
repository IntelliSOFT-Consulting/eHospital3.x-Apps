import React, {useEffect, useRef, useState} from "react";
import styles from "./home-dashboard.scss";
import {useTranslation} from "react-i18next";
import PatientQueueIllustration from "./patient-queue-illustration.component";
import MetricsCard from "./dashboard-card/dashboard-card.component";
import {
  DatePicker,
  DatePickerInput,
  DataTableSkeleton,
  Link,
  Tab,
  Tabs,
  TabList,
  IconSwitch, 
  ContentSwitcher, 
  RadioButton, 
  ExpandableSearch,
  InlineLoading
} from "@carbon/react";
import {ChartLineSmooth, Table as TableIcon} from "@carbon/react/icons";
import { useOPDCategories } from "../hooks/useOPDCategories";
import { useOPDPatientList } from "../hooks/useOPDPatientList";
import ReportsTableComponent from "../components/reports-table.component";
import ReportsGraphicalChartComponent from "../components/reports-graphical-chart.component";

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
    data: opdCategoriesData,
    totalPatients: totalOPDCategoryPatients,
    totalOpdVisits: totalOPDCategoryVisits,
    totalOpdRevisits: totalOPDCategoryRevisits,
    summary: opdCategorySummary,
    dateRange: opdCategoryDateRange,
    loading,
    getOPDVisits,
    setCategory,
    setDateRange: setCategoryDateRange,
    category
  } = useOPDCategories();

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
    }
  ]

  if (category === "outPatientClients" || category === "opdVisits" || category === "opdRevisits" || category === "consultation"){
    tableData.push({
      header: t('diagnosis', 'Diagnosis'),
      key: 'diagnosis'
    })
  }

  const filteredData = opdCategoriesData?.filter((patient) => {
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
      diagnosis: patient.diagnosis,
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
          value: opdCategorySummary.groupYear[monthAbbrev] || 0
        }
      })
    } else if (view === "monthly") {
      updatedChartData = Object.keys(opdCategorySummary.groupMonth || {}).map(week => ({
        group: formatWeekLabel(week),
        value: opdCategorySummary.groupMonth[week] || 0
      }));
    }
    setChartData(updatedChartData)
  }, [opdCategorySummary, opdCategoryDateRange, view]);

  const categoryToIndexMap = {
    outPatientClients: 0,
    opdVisits: 1,
    opdRevisits: 2,
    consultation: 3,
    dental: 4,
    ultrasound: 5,
    pharmacy: 6,
    laboratory: 7,
  };
  
  const indexToCategoryMap = {
    0: "outPatientClients",
    1: "opdVisits",
    2: "opdRevisits",
    3: "consultation",
    4: "dental",
    5: "ultrasound",
    6: "pharmacy",
    7: "laboratory",
  };
  
  const handleTabClick = (index) => {
    setCategory(indexToCategoryMap[index]);
  };

  return (
    <div className={styles.container}>
        <>
          <div className={styles.header} data-testid="patient-queue-header">
            <div className={styles["left-justified-items"]}>
              <PatientQueueIllustration/>
              <div className={styles.pageLabels}>
                <p className={styles.title}>{t("outPatient", "Outpatient")}</p>
              </div>
            </div>
          </div>


          <div className={styles.homeContainer}>
            <div className={styles.cardContainerParent} data-testid="clinic-metrics">
              <MetricsCard
                className="metricsCard"
                label={t("total", "Total")}
                value={totalOPDCategoryPatients.toString()}
                headerLabel={t("totalOPDVisits", "Total Patients")}
              />
              <MetricsCard
                className="metricsCard"
                label={t("total", "Total")}
                value={totalOPDCategoryVisits.toString()}
                headerLabel={t("totalOPDVisitsForPeriod", "Total OPD Visits")}
              />
              <MetricsCard
                className="metricsCard"
                label={t("total", "Total")}
                value={totalOPDCategoryRevisits.toString()}
                headerLabel={t("totalOPDVisitsForPeriod", "Total OPD Revisits")}
              />
            </div>

            <div className={styles.dashboardIcons}>
              <Tabs selectedIndex={categoryToIndexMap[category]} onChange={handleTabClick}>
                <TabList contained>
                  <Tab onClick={() => handleTabClick(0)}>All</Tab>
                  <Tab onClick={() => handleTabClick(1)}>OPD Visits</Tab>
                  <Tab onClick={() => handleTabClick(2)}>OPD Revisits</Tab>
                  <Tab onClick={() => handleTabClick(3)}>Consultation</Tab>
                  <Tab onClick={() => handleTabClick(4)}>Dental</Tab>
                  <Tab onClick={() => handleTabClick(5)}>Ultrasound</Tab>
                  {/* <Tab>Pharmacy</Tab> */}
                  {/* <Tab>Laboratory</Tab> */}
                </TabList>
              </Tabs>
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
                  <div className={styles.timeFilters}>
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
                  {opdCategoryDateRange.start && (
                    <DatePicker
                      onChange={(value) => {
                        setCategoryDateRange({start: value[0], end: value[1]})
                      }}
                      value={[opdCategoryDateRange.start, opdCategoryDateRange.end]}
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

                <ContentSwitcher 
                  size="sm" 
                  className={styles.contentSwitcher} 
                  selectedIndex={listActive ? 0 : 1}
                >
                  <IconSwitch name="tableView" text="Table view" onClick={activateList}>
                    <TableIcon size={16}/>
                  </IconSwitch>
                  <IconSwitch name="chartView" text="Chart view" onClick={activateChart}>
                    <ChartLineSmooth size={16}/>
                  </IconSwitch>
                </ContentSwitcher>
              </div>
              {loading ? (
                <div>
                  {listActive ? (
                    <DataTableSkeleton columns={tableData?.length} rows={5} />
                  ) : (
                    <div className={styles.loading} style={{ width: '100%', height: '400px' }}>
                      <InlineLoading className={styles.loading} description={t('loading', 'Loading...')} />
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  {listActive ? (
                    <ReportsTableComponent
                      dateRange={opdCategoryDateRange}
                      tableData={tableData}
                      paginatedData={paginatedData}
                      rowData={rowData}
                    />
                  ) : (
                    <ReportsGraphicalChartComponent chartData={chartData} />
                  )}
                </div>
              )}
            </div>

          </div>
        </>
      
    </div>
  );
};

export default PatientVisitsReportHome;
