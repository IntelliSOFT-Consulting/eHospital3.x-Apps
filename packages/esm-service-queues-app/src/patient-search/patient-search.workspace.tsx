import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SearchTypes } from '../types';
import PatientScheduledVisits from './patient-scheduled-visits.component';
import VisitForm from './visit-form/visit-form.component';
import {
  type DefaultWorkspaceProps,
  Workspace2,
  usePatient,
  useVisit,
  PatientPhoto,
  displayName,
} from '@openmrs/esm-framework';
import ExistingVisitFormComponent from './visit-form/existing-visit-form.component';
import styles from './patient-search.scss';

interface PatientSearchProps extends DefaultWorkspaceProps {
  viewState?: {
    selectedPatientUuid?: string;
  };
  selectedPatientUuid?: string;
  patientUuid?: string;
  workspaceProps?: {
    selectedPatientUuid?: string;
    patientUuid?: string;
  };
}

const PatientSearch: React.FC<PatientSearchProps> = ({ closeWorkspace, viewState, selectedPatientUuid: propSelectedPatientUuid, patientUuid: propPatientUuid, workspaceProps }) => {
  const selectedPatientUuid = propSelectedPatientUuid || propPatientUuid || viewState?.selectedPatientUuid || workspaceProps?.selectedPatientUuid || workspaceProps?.patientUuid;
  const { patient } = usePatient(selectedPatientUuid);
  const { activeVisit } = useVisit(selectedPatientUuid);
  
  // If workspaceProps.patientUuid is present, it means the external search app
  // launched this workspace specifically via the "Start Visit" action.
  const isStartVisitAction = !!workspaceProps?.patientUuid;
  
  const [searchType, setSearchType] = useState<SearchTypes>(
    isStartVisitAction ? SearchTypes.VISIT_FORM : SearchTypes.SCHEDULED_VISITS
  );
  const [newVisitMode, setNewVisitMode] = useState<boolean>(isStartVisitAction);
  const [showContactDetails, setContactDetails] = useState(false);

  const toggleSearchType = (searchType: SearchTypes, mode: boolean = false) => {
    setSearchType(searchType);
    setNewVisitMode(mode);
  };

  const { t } = useTranslation();
  const patientName = patient && displayName(patient);
  return patient ? (
    <Workspace2 title={t('addPatientToQueue', 'Add patient to queue')}>
      <div className={styles.patientBannerContainer}>
        <div className={styles.patientBanner} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem' }}>
          <div className={styles.patientPhoto}>
            <PatientPhoto patientUuid={patient.id} patientName={patientName} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 600 }}>{patientName}</span>
            <span>{patient.gender} &middot; {patient.birthDate}</span>
          </div>
        </div>
      </div>
      <div>
        {activeVisit ? (
          <ExistingVisitFormComponent visit={activeVisit} closePanel={closeWorkspace} />
        ) : searchType === SearchTypes.SCHEDULED_VISITS ? (
          <PatientScheduledVisits
            patientUuid={selectedPatientUuid}
            toggleSearchType={toggleSearchType}
            closeWorkspace={closeWorkspace}
          />
        ) : searchType === SearchTypes.VISIT_FORM ? (
          <VisitForm
            patientUuid={selectedPatientUuid}
            toggleSearchType={toggleSearchType}
            closePanel={closeWorkspace}
            mode={newVisitMode}
          />
        ) : null}
      </div>
    </Workspace2>
  ) : null;
};

export default PatientSearch;
