import React, { useCallback, useState } from "react";
import styles from "./home-dashboard.scss";
import { useTranslation } from "react-i18next";
import { useConfig } from "@openmrs/esm-framework";
import PatientQueueIllustration from "./patient-queue-illustration.component";
import MetricsCard from "./dashboard-card/dashboard-card.component";
import {
  DataTable,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  DatePicker,
  DatePickerInput,
  Button,
  DataTableSkeleton,
  Tile,
  SkeletonPlaceholder,
} from "@carbon/react";
import { usePatientList } from "../hooks/usePatientList";

type PatientListHomeProps = {
  patientUuid?: string;
};

const PatientListHome: React.FC<PatientListHomeProps> = () => {
  const { t } = useTranslation();
  const config = useConfig();

  const { patient, isLoading, isError } = usePatientList();

  const totalPatients = patient?.total || 0;

  const state = {};

  const rows =
    patient?.entry?.map((entry: any) => {
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

  const headers = [
    {
      key: "name",
      header: "Name",
    },
    {
      key: "gender",
      header: "Gender",
    },

    {
      key: "age",
      header: "Age",
    },
    {
      key: "id",
      header: "ID",
    },
    {
      key: "opd",
      header: "OPD Number",
    },
    {
      key: "dateRegistered",
      header: "Date Registered",
    },
    {
      key: "timeRegistered",
      header: "Time Registered",
    },
  ];

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
            <SkeletonPlaceholder style={{ width: "100%" }} />
          </Tile>
        </div>
        <DataTableSkeleton headers={headers} aria-label="sample table" />
        <br />
      </div>
    );
  }

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
        <div className={styles.listFilter}>
          <DatePicker datePickerType="range" dateFormat="d/m/Y">
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
        <DataTable rows={rows} headers={headers}>
          {({ rows, headers, getTableProps, getRowProps }) => (
            <Table {...getTableProps()}>
              <TableHead>
                <TableRow>
                  {headers.map((header) => (
                    <TableHeader>{header.header}</TableHeader>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow {...getRowProps({ row })}>
                    {row.cells.map((cell) => (
                      <TableCell key={cell.id}>{cell.value}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </DataTable>
      </div>
    </>
  );
};

export default PatientListHome;
