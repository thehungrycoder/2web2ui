import React from 'react';
import styles from './Empty.module.scss';

const Empty = ({ height, title, children }) => (
  <div className={styles.Empty} style={{ height }}>
    <div>
      <h3 className={styles.Title}>{title}</h3>
      {children && <p className={styles.Content}>{children}</p>}
    </div>
  </div>
);

Empty.defaultProps = {
  height: '220px',
  title: 'No Data Available'
};

export default Empty;
