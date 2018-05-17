import React from 'react';
import ScrollToTop from './ScrollToTop';
import Navigation from 'src/components/navigation/Navigation';
import WindowSize from 'src/context/WindowSize';
import styles from './Layout.module.scss';

const App = ({ children }) => (
  <WindowSize>
    <div className={`${styles.wrapper} ${styles.app}`}>
      <Navigation />
      <main role="main" className={styles.content}>
        <div className={styles.container}>
          {children}
        </div>
      </main>
      <ScrollToTop/>
    </div>
  </WindowSize>
);

export default App;
