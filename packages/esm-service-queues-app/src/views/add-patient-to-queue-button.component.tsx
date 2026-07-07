import React from 'react';
import { Button } from '@carbon/react';
import { Add as AddIcon } from '@carbon/react/icons';
import { launchWorkspace2, type Workspace2DefinitionProps } from '@openmrs/esm-framework';
import { useTranslation } from 'react-i18next';

interface AddPatientToQueueButtonProps {
  selectedQueueUuid?: string;
}

const AddPatientToQueueButton: React.FC<AddPatientToQueueButtonProps> = ({ selectedQueueUuid }) => {
  const { t } = useTranslation();

  return (
    <Button
      kind="secondary"
      renderIcon={(props) => <AddIcon size={16} {...props} />}
      size="sm"
      onClick={() =>
        launchWorkspace2(
          'queue-patient-search-workspace',
          {
            initialQuery: '',
            workspaceTitle: t('addPatientToQueue', 'Add patient to queue'),
            onPatientSelected(
              patientUuid: string,
              patient: fhir.Patient,
              launchChildWorkspace: Workspace2DefinitionProps['launchChildWorkspace'],
              closeWorkspace: Workspace2DefinitionProps['closeWorkspace'],
            ) {
              launchChildWorkspace('service-queues-patient-search', {
                currentServiceQueueUuid: selectedQueueUuid,
                selectedPatientUuid: patient.id,
              });
            },
          },
          {
            startVisitWorkspaceName: 'service-queues-patient-search',
          },
        )
      }>
      {t('addPatientToQueue', 'Add patient to queue')}
    </Button>
  );
};

export default AddPatientToQueueButton;
