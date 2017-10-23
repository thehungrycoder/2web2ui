import React from 'react';
import ScrollToTop from './ScrollToTop';
import styles from './Layout.module.scss';

const Form = ({ children }) => (
  <div className={`${styles.wrapper} ${styles.form}`}>
    <main role="main" className={styles.content}>
      <div className={styles.container}>
        { children }
      </div>
    </main>
    <ScrollToTop/>
  </div>
);

export default Form;
