import React from 'react';
import ScrollToTop from './ScrollToTop';
import styles from './Layout.module.scss';

const LargeForm = ({ children }) => (
  <div className={`${styles.wrapper} ${styles.largeForm}`}>
    <main role="main" className={styles.content}>
      <div className={styles.container}>
        {children}
      </div>
    </main>
    <ScrollToTop/>
  </div>
);

export default LargeForm;
