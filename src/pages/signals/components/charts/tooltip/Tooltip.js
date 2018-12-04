import React from 'react';
import { formatDate } from 'src/helpers/date';
import styles from './Tooltip.module.scss';
import './Tooltip.scss';

const Tooltip = ({ children, date }) => (
  <div className={styles.TooltipWrapper}>
    {date && (
      <div className={styles.TooltipDate}>
        {formatDate(date)}
      </div>
    )}
    <div className={styles.TooltipContent}>
      {children}
    </div>
  </div>
);

export default Tooltip;
