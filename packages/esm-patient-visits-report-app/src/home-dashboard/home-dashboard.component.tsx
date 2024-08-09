import React, { useEffect, useState } from "react";
import styles from "./home-dashboard.scss";
import {useTranslation} from "react-i18next";
import PatientQueueIllustration from "./patient-queue-illustration.component";
import MetricsCard from "./dashboard-card/dashboard-card.component";
import {
  DatePicker,
  DatePickerInput,
  Tile,
  SkeletonPlaceholder,
  DataTable,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  TableToolbar,
  TableToolbarContent,
  TableToolbarSearch,
  DataTableSkeleton,
  Pagination,
  Link
} from "@carbon/react";
import {useOPDPatientList} from "../hooks/useOPDPatientList";
// import DataTable from "react-data-table-component";

type PatientVisistsReportHomeProps = {
  patientUuid?: string;
};

const PatientVisitsReportHome: React.FC<PatientVisistsReportHomeProps> = () => {
  const {t} = useTranslation();
  const [searchString, setSearchString] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  // const navigate = useNavigate();

  const {
    isLoading,
    data,
    // tableColumns,
    customStyles,
    setDateRange,
    dateRange,
    currentPaginationState,
    getOPDClients,
    clear,
    totalPatients,
    totalOpdPatients,
    setTotalOpdPatients,
    setTotalPatients
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
              <SkeletonPlaceholder />
            </Tile>
          </div>
          <br/>
          <DataTableSkeleton columns={tableData?.length} rows={5} />
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
                // service="scheduled"
              />
              <MetricsCard
                className="metricsCard"
                label={t("total", "Total")}
                value={totalPatients ? totalPatients.toString() : 0}
                headerLabel={t("totalOPDVisitsForPeriod", "Total OPD Visits for Period")}
                // service="scheduled"
              />
            </div>
            <div className={styles.datatable}>
              <h1 className={styles.tableTitle}></h1>
              <DataTable
                useZebraStyles={true}
                rows={paginatedData}
                headers={tableData}
              >
                {({ rows, headers, getRowProps, getTableProps }) => (
                  <TableContainer {...getTableProps()} className={styles.table}>
                    <TableToolbar className={styles.tableToolbar}>
                      <TableToolbarContent className={styles.tableToolbarContent}>
                        <TableToolbarSearch
                          onChange={(e) => setSearchString(e.target.value)}
                          placeholder={t("searchByDiagnosis", "Search by Diagnosis")}
                        />
                        <div className={styles.listFilter}>
                          <DatePicker
                            onChange={(value) =>
                              setDateRange({start: value[0], end: value[1]})
                            }
                            value={[dateRange.start, dateRange.end]}
                            datePickerType="range"
                            dateFormat="d/m/Y"
                            className={styles.filterDatePicker}
                          >
                            <DatePickerInput
                              id="date-picker-input-id-start"
                              placeholder="dd/mm/yyyy"
                              labelText="Start date"
                              size="md"
                            />
                            <DatePickerInput
                              id="date-picker-input-id-finish"
                              placeholder="dd/mm/yyyy"
                              labelText="End date"
                              size="md"
                            />
                          </DatePicker>
                        </div>
                      </TableToolbarContent>
                    </TableToolbar>
                    <Table className={styles.tableBody}>
                      <TableHead>
                        <TableRow>
                          {headers.map((col) => (
                            <TableHeader key={col.key}>{col.header}</TableHeader>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {rows.map((row) => {
                          console.log(row);
                          return (<TableRow
                            key={row.id}
                            {...getRowProps({row})}
                           >
                            {row.cells.map((cell, index) => (
                              console.log(cell),
                              <TableCell key={index}>{typeof cell.value === 'function' ? cell.value() : cell.value}</TableCell>
                            ))}
                          </TableRow>)
                          })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </DataTable>
              <Pagination 
                totalItems={rowData.length}
                backwardText={t("previous", "Previous")}
                forwardText={t("next", "Next")}
                itemsPerPageText={t("itemsPerPage", "Items per page:")}
                page={currentPage}
                pageSize={itemsPerPage}
                pageSizes={[10, 20, 30, 40, 50]}
                onChange={({page, pageSize}) => {
                  setCurrentPage(page);
                  setItemsPerPage(pageSize);
                }}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PatientVisitsReportHome;
