import React, { useEffect, useState } from "react";
import styles from "./home-dashboard.scss";
import {useTranslation} from "react-i18next";
import PatientQueueIllustration from "./patient-queue-illustration.component";
import MetricsCard from "./dashboard-card/dashboard-card.component";
import {
  DatePicker,
  DatePickerInput,
  Button,
  Tile,
  SkeletonPlaceholder
} from "@carbon/react";
import {usePatientList} from "../hooks/usePatientList";
import DataTable from "react-data-table-component";

type PatientVisistsReportHomeProps = {
  patientUuid?: string;
};

const PatientVisitsReportHome: React.FC<PatientVisistsReportHomeProps> = () => {
  const {t} = useTranslation();

  const {
    isLoading,
    data,
    tableColumns,
    customStyles,
    setDateRange,
    dateRange,
    currentPaginationState,
    getAllClients,
    clear,
    totalPatients,
  } = usePatientList();

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
        </div>
      ) : (
        <>
          <div className={styles.header} data-testid="patient-queue-header">
            <div className={styles["left-justified-items"]}>
              <PatientQueueIllustration/>
              <div className={styles["page-labels"]}>
                <p className={styles.title}>{t("outPatient", "Out Patient")}</p>
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
              <div className={styles.listFilter}>
                <DatePicker
                  onChange={(value) =>
                    setDateRange({start: value[0], end: value[1]})
                  }
                  value={[dateRange.start, dateRange.end]}
                  datePickerType="range"
                  dateFormat="d/m/Y"
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
                {/* <Button
                  onClick={clear}
                  kind="secondary"
                  style={styles.FilterButton}
                >
                  Clear
                </Button> */}
              </div>
              <DataTable
                paginationPerPage={15}
                columns={tableColumns}
                data={data}
                responsive
                pagination
                customStyles={customStyles}
                subHeader
                striped
                title="Registered Patients"
                fixedHeader
                pointerOnHover
                className="rounded"
              />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default PatientVisitsReportHome;
