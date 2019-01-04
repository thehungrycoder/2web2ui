import React from 'react';
import { formatPrecisePercent } from 'src/helpers/units';
import styles from './DataCell.module.scss';

const PercentDataCell = ({ value }) => (
  <div className={styles.PaddedCell}>
    {value === null ? '- - -' : formatPrecisePercent(value)}
  </div>
);

export default PercentDataCell;
