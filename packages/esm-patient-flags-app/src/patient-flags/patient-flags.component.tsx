import React from "react";
import { Tag } from "@carbon/react";
import { useTranslation } from "react-i18next";
import { usePatientFlags } from "../hooks/usePatientFlags";
import styles from "./patient-flags.scss";

interface PatientFlagsProps {
  patientUuid: string;
}

const PatientFlags: React.FC<PatientFlagsProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const { patientFlags, error } = usePatientFlags(patientUuid);

  const pickTagClassname = (flag: string) => {
    switch (flag) {
      case "ACTIVE":
        return "greenTag";
      case "ELIGIBLE":
        return "greenTag";
      case "IIT":
        return "mustardTag";
      case "DIED":
        return "redTag";
      case "MISSED_APPOINTMENT":
        return "redTag";
      case "NOT_ELIGIBLE":
        return "redTag";
      case "TRANSFERRED_OUT":
        return "mustardTag";
      case "DUE_FOR_VL":
        return "greenTag";
      default:
        return "tag";
    }
  };

  if (error) {
    return <span>{t("errorPatientFlags", "Error loading patient flags")}</span>;
  }

  return (
    <div className={styles.flagContainer}>
      {patientFlags.map((patientFlag) => (
        <Tag
          className={styles[pickTagClassname(patientFlag)]}
          key={patientFlag}
        >
          {patientFlag?.replaceAll("_", " ")}
        </Tag>
      ))}
    </div>
  );
};

export default PatientFlags;
