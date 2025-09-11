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
      case "LLM_CONSENT_YES":
        return "greenTag";
      case "PATIENT_TYPE_SHA":
        return "greenTag";
      case "PATIENT_TYPE_STANDARD":
        return "mustardTag";
      case "LLM_CONSENT_NO":
        return "redTag";
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
          {patientFlag?.replace(/_/g, " ")}
        </Tag>
      ))}
    </div>
  );
};

export default PatientFlags;
