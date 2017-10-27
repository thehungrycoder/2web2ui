import React from 'react';

import styles from './PoolTypeahead.module.scss';

const PoolTypeaheadItem = ({ name, id }) => (
  <div className={styles.Item}>
    {name}
    <span className={styles.id}>{id}</span>
  </div>
);

export default PoolTypeaheadItem;
