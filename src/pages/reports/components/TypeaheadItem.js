import React from 'react';

import styles from './TypeaheadItem.module.scss';

const TypeaheadItem = ({ value, type }) => {
  return (
    <div className={styles.TypeaheadItem}>
      <span className={styles.Value}>{ value }</span>
      <span className={styles.Type}>{ type }</span>
    </div>
  );
};

export default TypeaheadItem;
