import React from 'react';
import styles from './TooltipMetric.module.scss';

const TooltipMetric = ({ label, value, color = '#6e6e73' }) => (
  <div className={styles.Wrapper}>
    <div className={styles.TooltipMetric}>
      <div style={{ background: color }} className={styles.Color} />
      <div className={styles.Content}>
        <div className={styles.Label}>{label}</div>
        <div className={styles.Value}>{value}</div>
      </div>
    </div>
  </div>
);

export default TooltipMetric;
