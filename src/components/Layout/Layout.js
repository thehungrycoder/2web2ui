import React from 'react';

import styles from './Layout.module.scss';
import Navigation from '../Navigation/Navigation';

const App = ({ children }) => (
  <div className={`${styles.wrapper} ${styles.accent}`}>
    <div className={styles.aside}>
      <Navigation />
    </div>
    <main role="main" className={styles.content}>
      <div className={styles.container}>
        { children }
      </div>
    </main>
  </div>
);

const Form = ({ children }) => (
  <div className={styles.wrapper}>
    <main role="main" className={styles.formContent}>
      <div className={styles.formContainer}>
        { children }
      </div>
    </main>
  </div>
);

class Layout {
  static App = App;
  static Form = Form;
}

export default Layout;
