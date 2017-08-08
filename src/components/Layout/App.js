import React from 'react';

import Navigation from '../Navigation/Navigation';
import GlobalError from '../GlobalError/GlobalError';
import styles from './Layout.module.scss';

const App = ({ children }) => (
  <div className={`${styles.wrapper} ${styles.accent}`}>
    <div className={styles.aside}>
      <Navigation />
    </div>
    <main role="main" className={styles.content}>
      <div className={styles.container}>
        { children }
      </div>
      <div className={styles.appError}>
        <GlobalError />
      </div>
    </main>
  </div>
);

export default App;
