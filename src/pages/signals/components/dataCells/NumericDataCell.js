import _ from 'lodash';
import React from 'react';
import styles from './DataCell.module.scss';

const NumericDataCell = ({ value }) => (
  <div className={styles.PaddedCell}>
    {_.isNil(value) ? '- - -' : value.toLocaleString()}
  </div>
);

export default NumericDataCell;
