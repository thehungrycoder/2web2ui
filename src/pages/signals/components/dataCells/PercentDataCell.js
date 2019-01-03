import React from 'react';
import { formatPercent } from 'src/helpers/units';
import styles from './DataCell.module.scss';

const PercentDataCell = ({ value }) => (
  <div className={styles.PaddedCell}>
    {value === null ? '- - -' : formatPercent(value)}
  </div>
);

export default PercentDataCell;
