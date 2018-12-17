import React, { Component } from 'react';
import { Panel } from '@sparkpost/matchbox';

import styles from './Empty.module.scss';

class Empty extends Component {
  render() {
    const { title, message, children } = this.props;

    return (
      <Panel sectioned title={title}>
        <div className={styles.Empty}>
          <h6 className={styles.Header}>{message}</h6>
          {children}
        </div>
      </Panel>
    );
  }
}

export default Empty;
