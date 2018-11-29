import React from 'react';
import { Select } from '@sparkpost/matchbox';
import styles from './FacetFilter.module.scss';

const OPTIONS = [
  'No Breakdown',
  'By Sending Domain',
  'By IP Pool',
  'By Campaign'
];

const FacetFilter = (props) => (
  <div className={styles.FacetFilter}>
    <Select options={OPTIONS} />
  </div>
);

export default FacetFilter;
