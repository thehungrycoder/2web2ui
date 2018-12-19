import React, { Fragment } from 'react';
import styles from './ChartHeader.module.scss';

const ChartHeader = ({ title, primaryArea }) => (
  <Fragment>
    <div className={styles.ChartHeader}>
      <h6 className={styles.Title}>{title}</h6>
      {primaryArea && <div>{primaryArea}</div>}
    </div>
    <hr className={styles.Line} />
  </Fragment>
);

export default ChartHeader;
