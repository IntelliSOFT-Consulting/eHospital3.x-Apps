import React, { useMemo } from "react";
import styles from "./home-dashboard.scss";
import { useTranslation } from "react-i18next";
import { useConfig } from "@openmrs/esm-framework";
import PatientQueueIllustration from "./patient-queue-illustration.component";
import MetricsCard from "./dashboard-card/dashboard-card.component";
import {
  DatePicker,
  DatePickerInput,
  Button,
  Tile,
  SkeletonPlaceholder,
} from "@carbon/react";
import { usePatientList } from "../hooks/usePatientList";
import DataTable from "react-data-table-component";

type PatientListHomeProps = {
  patientUuid?: string;
};

const PatientListHome: React.FC<PatientListHomeProps> = () => {
  const { t } = useTranslation();
  const config = useConfig();

  const [dateRange, setDateRange] = React.useState(null);

  const { patient, isLoading, isError } = usePatientList();

  const sortedPatients = patient?.entry?.sort(
    (a, b) =>
      new Date(b.resource.meta.lastUpdated) -
      new Date(a.resource.meta.lastUpdated)
  );

  const totalPatients = patient?.total || 0;

  const rows =
    sortedPatients?.map((entry: any) => {
      const patientData = entry.resource;
      const fullName = patientData.name
        ?.map((name: any) => name.given?.join(" ") + " " + name.family)
        .join(", ");
      const age =
        new Date().getFullYear() -
        new Date(patientData.birthDate).getFullYear();
      const gender = patientData.gender?.toUpperCase();
      const openmrsID = patientData.identifier?.find(
        (id: any) => id.type?.text === "OpenMRS ID"
      )?.value;
      const opdNumber = patientData.identifier?.find(
        (id: any) => id.type?.text === "Unique OPD number"
      )?.value;
      const dateRegistered = new Date(
        patientData.meta?.lastUpdated
      ).toLocaleDateString();
      const timeRegistered = new Date(
        patientData.meta?.lastUpdated
      ).toLocaleTimeString();
      return {
        name: fullName,
        gender: gender,
        age: age.toString(),
        id: openmrsID,
        opd: opdNumber,
        dateRegistered: dateRegistered,
        timeRegistered: timeRegistered,
      };
    }) || [];

  if (isLoading) {
    return (
      <div
        style={{
          width: "100%",
        }}
      >
        <div className={styles.header} data-testid="patient-queue-header">
          <div className={styles["left-justified-items"]}>
            <PatientQueueIllustration />
            <div className={styles["page-labels"]}>
              <p className={styles.title}>{t("patients", "Patients")}</p>
              <p className={styles.subTitle}>{t("dashboard", "Dashboard")}</p>
            </div>
          </div>
        </div>
        <div className={styles.cardContainer} data-testid="registered-patients">
          <Tile className={styles.tileContainer}>
            <SkeletonPlaceholder />
          </Tile>
        </div>
        <br />
      </div>
    );
  }

  const customStyles = {
    cells: {
      style: {
        minHeight: "72px",
        fontSize: "14px",
        fontWeight: "500",
      },
    },
    headCells: {
      style: {
        fontSize: ".9rem",
        fontWeight: "600",
      },
    },
  };

  const columns = [
    {
      name: "Name",
      selector: (row) => row.name,
    },
    {
      name: "ID",
      selector: (row) => row.id,
    },
    {
      name: "Gender",
      selector: (row) => row.gender,
    },
    {
      name: "Age",
      selector: (row) => row.age,
    },
    {
      name: "OPD Number",
      selector: (row) => row.opd,
    },
    {
      name: "Date Registered",
      selector: (row) => row.dateRegistered,
    },
    {
      name: "Time Registered",
      selector: (row) => row.timeRegistered,
    },
  ];

  return (
    <>
      <div className={styles.header} data-testid="patient-queue-header">
        <div className={styles["left-justified-items"]}>
          <PatientQueueIllustration />
          <div className={styles["page-labels"]}>
            <p className={styles.title}>{t("patients", "Patients")}</p>
            <p className={styles.subTitle}>{t("dashboard", "Dashboard")}</p>
          </div>
        </div>
      </div>
      <div className={styles.homeContainer}>
        <div className={styles.cardContainer} data-testid="registered-patients">
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
              onChange={(value) => console.log("value", value)}
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
            <Button kind="primary" style={styles.FilterButton}>
              Search
            </Button>
          </div>
          <DataTable
            columns={columns}
            data={rows}
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
  );
};

export default PatientListHome;
