import React from 'react';
import { Loading} from "@carbon/react";
import styles from './loading.scss';

interface LoadingStateProps {
  message?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({ message = "Loading observations..." }) => (
  <div className={styles.loading}>
    <Loading small withOverlay={false} />
    <p>{message}</p>
  </div>
);

export default LoadingState;