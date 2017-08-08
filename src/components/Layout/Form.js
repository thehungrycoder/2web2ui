import React from 'react';

import GlobalError from '../GlobalError/GlobalError';
import styles from './Layout.module.scss';

const Form = ({ children }) => (
  <div className={styles.wrapper}>
    <main role="main" className={styles.formContent}>
      <div className={styles.formContainer}>
        { children }
      </div>
      <div className={styles.formError}>
        <GlobalError />
      </div>
    </main>
  </div>
);

export default Form;
