import React, { Fragment } from 'react';
import { getFriendlyTitle } from 'src/helpers/signals';
import styles from './OtherChartsHeader.module.scss';

const OtherChartsHeader = ({ facet, facetId }) => (
  <Fragment>
    <h2 className={styles.OtherChartsHeader}>
      {getFriendlyTitle({
        prefix: 'Other charts for',
        facet,
        facetId
      })}
    </h2>
    <hr />
  </Fragment>
);

export default OtherChartsHeader;
