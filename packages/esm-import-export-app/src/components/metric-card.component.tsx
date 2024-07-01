import React from 'react';
import styles from './styles/metric-card.scss';

const MetricCardComponent: React.FC<{stat: string | number, title: string}> = ({ stat, title })  =>{
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{title}</h1>
      <span className={styles.count}>{stat}</span>
    </div>
  );
}

export default MetricCardComponent;
