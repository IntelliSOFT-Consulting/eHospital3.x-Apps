import React from "react";
import { useTranslation } from "react-i18next";
import { RadioButtonGroup, RadioButton } from "@carbon/react";
import styles from "./visit-attributes-form.scss";

type VisitAttributesFormProps = {
  consent?: string;
  setConsent?: (value: string) => void;
  patientType?: string;
  setPatientType?: (value: string) => void;
};

const VisitAttributesForm: React.FC<VisitAttributesFormProps> = ({
  consent,
  setConsent,
  patientType,
  setPatientType,
}) => {
  const { t } = useTranslation();

  return (
    <section>
      <div className={styles.sectionTitle}>
        {t("paymentDetails", "Payment Details")}
      </div>
      <RadioButtonGroup
        onChange={(value) => {
          setConsent?.(value);
        }}
        value={consent}
        orientation="vertical"
        legendText={t("llmConsent", "LLM Consent")}
        name="llm-consent"
      >
        <RadioButton labelText="Yes" value="yes" id="yes-radio" />
        <RadioButton labelText="No" value="no" id="no-radio" />
      </RadioButtonGroup>

      <RadioButtonGroup
        onChange={(value) => {
          setPatientType?.(value);
        }}
        value={patientType}
        orientation="vertical"
        legendText={t("patientType", "Patient Type")}
        name="patient-type"
      >
        <RadioButton
          labelText="SHA Patient"
          value="shaPatient"
          id="sha-patient-radio"
        />
        <RadioButton
          labelText="Standard Patient"
          value="standardPatient"
          id="standard-patient-radio"
        />
      </RadioButtonGroup>
    </section>
  );
};

export default VisitAttributesForm;
