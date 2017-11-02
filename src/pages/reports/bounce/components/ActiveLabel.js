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
    <span className={styles.Label}>{name}</span>
    <span className={styles.Line}/>
    <span className={styles.Value}>{value}</span>
  </div>
);

export default ActiveLabel;
