import React from 'react';
import { Panel } from '@sparkpost/matchbox';

import styles from './Empty.module.scss';

const Empty = () => (
  <Panel sectioned title='Bounce Rates'>
    <h6 className={styles.Center}>No bounces to report</h6>
  </Panel>
);

export default Empty;
