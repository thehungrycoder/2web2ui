import React, { Component } from 'react';
import { connect } from 'react-redux';

import styles from './Layout.module.scss';

class Form extends Component {
  render () {
    const { children } = this.props;
    return (
      <div className={styles.wrapper}>
        <main role="main" className={styles.formContent}>
          <div className={styles.formContainer}>
            { children }
          </div>
        </main>
      </div>
    );
  }
}

export default Form;
