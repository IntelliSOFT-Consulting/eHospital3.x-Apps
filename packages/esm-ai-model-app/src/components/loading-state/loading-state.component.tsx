import React from 'react';
import { Loading} from "@carbon/react";
import styles from './loading.scss';

const LoadingState: React.FC = () => (
  <div className={styles.loading}>
    <Loading small withOverlay={false} />
    <p>Loading observations...</p>
  </div>
);

export default LoadingState;