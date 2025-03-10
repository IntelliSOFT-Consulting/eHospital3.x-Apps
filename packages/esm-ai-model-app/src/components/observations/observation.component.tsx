import React from 'react';
import styles from './observation.scss';
import ObservationDetail from './observation-detail.component';

interface ObservationProps {
  obs: {
    gender?: string;
    age?: number;
    weight?: number;
    height?: number;
    bmi?: number;
    bloodPressure?: string;
    heartRate?: number;
    temperature?: number;
    diagnosis?: string;
    medication?: string[];
    tests?: { name: string; results?: { parameter: string; value: string }[] }[];
    condition?: string[];
  };
}

const Observation: React.FC<ObservationProps> = ({ obs }) => {
  const hasData = Object.values(obs).some(value => value);

  if (!hasData) return null;

  return (
    <div className={styles.observation}>
      <ObservationDetail label="Sex" value={obs.gender} />
      <ObservationDetail label="Age" value={obs.age} />
      <ObservationDetail label="Weight" value={obs.weight} />
      <ObservationDetail label="Height" value={obs.height} />
      <ObservationDetail label="BMI" value={obs.bmi} />
      <ObservationDetail label="Blood Pressure" value={obs.bloodPressure} />
      <ObservationDetail label="Heart Rate" value={obs.heartRate} />
      <ObservationDetail label="Temperature" value={obs.temperature} />
      
      {obs.diagnosis && (
        <div>
          <p>Diagnosis:</p>
          <ul>
            {obs.diagnosis
              .replace(/[\[\]]/g, '')
              .split(',')
              .map((diag, index) => (
                <li key={index}>{diag.trim()}</li>
              ))}
          </ul>
        </div>
      )}

      {obs.medication?.length > 0 && (
        <ObservationDetail label="Medications" value={obs.medication.join(', ')} />
      )}

      {obs.tests?.length > 0 && (
        <div>
          <p>Tests:</p>
          {obs.tests.map((test, testIndex) => (
            <div key={testIndex}>
              <strong>{test.name}</strong>
              {test.results?.map((result, resultIndex) => (
                <p key={resultIndex}>
                  {result.parameter}: {result.value}
                </p>
              ))}
            </div>
          ))}
        </div>
      )}

      {obs.condition?.length > 0 && (
        <ObservationDetail label="Conditions" value={obs.condition.join(', ')} />
      )}
    </div>
  );
};

export default Observation;