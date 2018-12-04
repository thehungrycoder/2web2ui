import React from 'react';
import { Select } from '@sparkpost/matchbox';
import styles from './DateFilter.module.scss';

const OPTIONS = [
  'Last 7 Days',
  'Last 14 Days',
  'Last 30 Days',
  'Last 90 Days'
];

const DateFilter = (props) => (
  <div className={styles.DateFilter}>
    <Select options={OPTIONS} />
  </div>
);

export default DateFilter;
