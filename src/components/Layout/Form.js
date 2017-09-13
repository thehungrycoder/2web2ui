import React from 'react';

import ScrollToTop from './ScrollToTop';
import { Loading, GlobalError } from 'components';
import styles from './Layout.module.scss';

const Form = ({ children, loading }) => (
  <div className={styles.wrapper}>
    <main role="main" className={styles.formContent}>
      <div className={styles.formContainer}>
        { loading ? <div className={styles.loading}><Loading /></div> : children }
      </div>
      <div className={styles.formError}>
        <GlobalError />
      </div>
    </main>
    <ScrollToTop/>
  </div>
);

export default Form;
