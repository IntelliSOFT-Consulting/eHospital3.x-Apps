import { usePatient } from '@openmrs/esm-framework';
import React from 'react';

const PatientName: React.FC<{ uuid: string }> = ({ uuid }) => {
  const { patient } = usePatient(uuid);

  return <>{patient?.name || 'Loading...'}</>;
};

export default PatientName;
