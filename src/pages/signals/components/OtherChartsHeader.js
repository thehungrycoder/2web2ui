import React, { Fragment } from 'react';
import styles from './OtherChartsHeader.module.scss';

const OtherChartsHeader = ({ facetId }) => (
  <Fragment>
    <h2 className={styles.OtherChartsHeader}>Other charts for {facetId}</h2>
    <hr />
  </Fragment>
);

export default OtherChartsHeader;
