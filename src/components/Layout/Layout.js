import React from 'react';

import styles from './Layout.module.scss';
import Navigation from '../Navigation/Navigation';
import Loading from '../Loading/Loading';

const App = ({ children, loading }) => (
  <div className={`${styles.wrapper} ${styles.accent}`}>
    <div className={styles.aside}>
      <Navigation />
    </div>
    <main role="main" className={styles.content}>
      <div className={styles.container}>
        { loading ? <Loading className={styles.loading} /> : children }
      </div>
    </main>
  </div>
);

const Form = ({ children, loading }) => (
  <div className={styles.wrapper}>
    <main role="main" className={styles.formContent}>
      <div className={styles.formContainer}>
        { loading ? <Loading className={styles.loading} /> : children }
      </div>
    </main>
  </div>
);

class Layout {
  static App = App;
  static Form = Form;
}

export default Layout;
