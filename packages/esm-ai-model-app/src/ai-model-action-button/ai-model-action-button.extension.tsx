import React from "react";
import { useTranslation } from "react-i18next";
import { ActionMenuButton } from "@openmrs/esm-framework";
import { Chat } from "@carbon/react/icons";
import { useLaunchWorkspaceRequiringVisit } from '@openmrs/esm-patient-common-lib';

const AiModelActionButton: React.FC = () => {
  const { t } = useTranslation();
  const launchAiModelWorkSpace = useLaunchWorkspaceRequiringVisit('ai-model');

  return (
    <ActionMenuButton 
      getIcon={() => <Chat />}
      label={t('aiModel', 'AI Model')}
      iconDescription={t('aiModel', 'AI Model')}
      handler={launchAiModelWorkSpace}
      type={"button"}
    />
  )
}

export default AiModelActionButton