import React from 'react';
import styles from './ReasonCell.module.scss';

const ReasonCell = ({ reason }) => (
  <div className={styles.ReasonCell}>{reason}</div>
);

export default ReasonCell;
