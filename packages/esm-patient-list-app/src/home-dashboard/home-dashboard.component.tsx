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
  Link,
  DataTable,
  DataTableSkeleton,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  TableToolbar,
  TableToolbarContent,
  Pagination,
  Layer
} from "@carbon/react";
import {usePatientList} from "../hooks/usePatientList";

type PatientListHomeProps = {
  patientUuid?: string;
};

const PatientListHome: React.FC<PatientListHomeProps> = () => {
  const {t} = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const {
    isLoading,
    backgroundLoading,
    data,
    setDateRange,
    dateRange,
    totalPatients,
  } = usePatientList();

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
      header: t('dateRegistered', 'Date Registered'),
      key: 'dateRegistered',
    },
    {
      header: t('timeRegistered', 'Time Registered'),
      key: 'timeRegistered',
    }
  ]

  const rowData = data?.map((patient) => {
    return {
      id: patient.opdNumber,
      fullName: () => (
        <Link
          href={`${window.getOpenmrsSpaBase()}patient/${
            patient.uuid
          }/chart/Patient%20Summary`}
        >
          {patient.fullName}
        </Link>
      ),
      age: patient.age,
      gender: patient.gender,
      opdNumber: patient.opdNumber,
      openmrsID: patient.openmrsID,
      dateRegistered: patient.dateRegistered,
      timeRegistered: patient.timeRegistered
    }
  })

  const paginatedData = rowData?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
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
                <p className={styles.title}>{t("patients", "Patients")}</p>
                <p className={styles.subTitle}>{t("dashboard", "Dashboard")}</p>
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
          <DataTableSkeleton columns={tableData?.length} />
        </div>
      ) : (
        <>
          <div className={styles.header} data-testid="patient-queue-header">
            <div className={styles["left-justified-items"]}>
              <PatientQueueIllustration/>
              <div className={styles["page-labels"]}>
                <p className={styles.title}>{t("patients", "Patients")}</p>
                <p className={styles.subTitle}>{t("dashboard", "Dashboard")}</p>
              </div>
            </div>
          </div>
          <div className={styles.homeContainer}>
            <div
              className={styles.cardContainer}
              data-testid="registered-patients"
            >
              <MetricsCard
                label={t("total", "Total")}
                value={totalPatients.toString()}
                headerLabel={t("registeredPatients", "Registered Patients")}
                service="scheduled"
              />
            </div>
            <div className={styles.datatable}>
              <DataTable
                rows={paginatedData}
                headers={tableData}
              >
                {({ rows, headers, getRowProps, getTableProps }) => (
                  <TableContainer 
                    {...getTableProps()} 
                    className={styles.table} 
                    title={<span className={styles.tableTitle}>{t("registeredPatients", "Registered Patients")}</span>}
                    >
                    <TableToolbar className={styles.tableToolbar}>
                      <TableToolbarContent className={styles.tableToolbarContent}>
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
                          return (
                            <TableRow
                              key={row.id}
                              {...getRowProps({row})}
                            >
                              {row.cells.map((cell, index) => (
                                <TableCell key={index}>{typeof cell.value === 'function' ? cell.value() : cell.value}</TableCell>
                              ))}
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </DataTable>
              {rowData?.length === 0 && (
                <div className={styles.emptyStateText}>
                  <Layer level={0}>
                    <Tile className={styles.emptyStateTile}>
                      <p className={styles.filterEmptyStateContent}>
                        {t('noData', 'No data to display. Please select a date range to fetch data.')}
                      </p>
                    </Tile>
                  </Layer>
                </div>
              )}
            </div>
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
        </>
      )}
    </>
  );
};

export default PatientListHome;
