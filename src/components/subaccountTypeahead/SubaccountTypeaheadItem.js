import React from 'react';

import styles from './SubaccountTypeahead.module.scss';

const SubaccountTypeaheadItem = ({ name, id }) => (
  <div className={styles.Item}>
    {name}
    <span className={styles.id}>{id}</span>
  </div>
);

export default SubaccountTypeaheadItem;
