import _ from 'lodash';
import React from 'react';
import { formatPercent } from 'src/helpers/units';
import styles from './DataCell.module.scss';

const PercentDataCell = ({ value }) => (
  <div className={styles.PaddedCell}>
    {_.isNil(value) ? '- - -' : formatPercent(value * 100)}
  </div>
);

export default PercentDataCell;
