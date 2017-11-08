import React from 'react';
import styles from './ActiveLabel.module.scss';

/**
 * Label that appears inside pie chart
 */
const ActiveLabel = ({
  name,
  value
}) => (
  <div className={styles.ActiveLabel}>
    <div className={styles.Label}>{name}</div>
    <div className={styles.Line}/>
    <div className={styles.Value}>{value}</div>
  </div>
);

export default ActiveLabel;
