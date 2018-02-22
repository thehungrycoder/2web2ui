import React from 'react';
import styles from './Legend.module.scss';

function renderMetric(metric) {
  return (
    <div className={styles.Metric} key={metric.name}>
      <span className={styles.Color} style={{ backgroundColor: metric.stroke }}/>
      { metric.label }
    </div>
  );
}
export default function Legend(props) {
  const { metrics } = props;

  return (
    <div className={styles.Legend}>
      { metrics && metrics.map(renderMetric) }
    </div>
  );
}
