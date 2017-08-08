import React, { Component } from 'react';
import { connect } from 'react-redux';

import styles from './Layout.module.scss';
import Navigation from '../Navigation/Navigation';

class App extends Component {
  render () {
    const { children } = this.props;

    return (
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
  }
}

const mapStateToProps = ({ apiFailure }) => ({ apiFailure });
export default connect(mapStateToProps)(App);
