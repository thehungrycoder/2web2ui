import React from 'react';
import styles from './Callout.module.scss';

const Callout = ({ children, height = '220px', title }) => (
  <div className={styles.Callout} style={{ height }}>
    <div>
      <h3 className={styles.Title}>{title}</h3>
      {children && <p className={styles.Content}>{children}</p>}
    </div>
  </div>
);

export default Callout;
