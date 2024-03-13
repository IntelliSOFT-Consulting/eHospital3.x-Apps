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
} from "@carbon/react";

type PatientListHomeProps = object;

const PatientListHome: React.FC<PatientListHomeProps> = () => {
  const { t } = useTranslation();
  const config = useConfig();

  const state = {};

  const rows = [
    {
      name: "Patient 1",
      gender: "Male",
      id: "1234",
      dateRegistered: "12-02-2024",
      timeRegistered: "18:22:41",
    },
    {
      name: "Patient 2",
      gender: "Female",
      id: "07654",
      dateRegistered: "12-02-2024",
      timeRegistered: "18:22:42",
    },
    {
      name: "Patient 3",
      gender: "Female",
      id: "56789",
      dateRegistered: "12-02-2024",
      timeRegistered: "18:22:43",
    },
  ];

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
      key: "id",
      header: "ID",
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
  return (
    <>
      <div className={styles.homeContainer}>
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
          <MetricsCard
            label={t("total", "Total")}
            value="20"
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
          {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
            <Table {...getTableProps()}>
              <TableHead>
                <TableRow>
                  {headers.map((header) => (
                    <TableHeader {...getHeaderProps({ header })}>
                      {header.header}
                    </TableHeader>
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
