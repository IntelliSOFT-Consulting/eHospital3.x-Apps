import React from 'react';

interface ObservationDetailProps {
  label: string;
  value?: string | number;
}

const ObservationDetail: React.FC<ObservationDetailProps> = ({ label, value }) => {
  if (!value) return null;
  return (
    <p>
      <strong>{label}:</strong> {value}
    </p>
  );
};

export default ObservationDetail;