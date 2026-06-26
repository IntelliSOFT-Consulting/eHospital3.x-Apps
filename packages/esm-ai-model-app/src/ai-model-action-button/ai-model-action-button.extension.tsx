import React, { type ComponentProps } from "react";
import { useTranslation } from "react-i18next";
import { ActionMenuButton2 } from "@openmrs/esm-framework";
import { Chat } from "@carbon/react/icons";
import { useStartVisitIfNeeded, type PatientChartWorkspaceActionButtonProps } from '@openmrs/esm-patient-common-lib';

const AiModelActionButton: React.FC<PatientChartWorkspaceActionButtonProps> = ({ groupProps: { patientUuid } }) => {
  const { t } = useTranslation();
  const startVisitIfNeeded = useStartVisitIfNeeded(patientUuid);

  return (
    <ActionMenuButton2
      icon={(props: ComponentProps<typeof Chat>) => <Chat {...props} />}
      label={t('aiModel', 'AI Model')}
      workspaceToLaunch={{
        workspaceName: 'ai-model',
        workspaceProps: {},
      }}
      onBeforeWorkspaceLaunch={startVisitIfNeeded}
    />
  )
}

export default AiModelActionButton