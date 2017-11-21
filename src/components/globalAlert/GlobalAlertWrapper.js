/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import TransitionGroup from 'react-transition-group/TransitionGroup';
import { clear } from 'src/actions/globalAlert';
import { Portal, Snackbar } from '@sparkpost/matchbox';

import Animator from './Animator';
import Alert from './Alert';
import styles from './GlobalAlertWrapper.module.scss';

class GlobalAlertWrapper extends Component {
  renderAlerts() {
    return this.props.alerts.map((alert, i) => {
      return (
        <Animator key={`${alert.message}-${alert.date}`}>
          <Alert onDismiss={() => this.props.clear(i)} {...alert}></Alert>
        </Animator>
      );
    });
  }

  render() {
    return (
      <Portal containerId='alert-portal'>
        <div className={styles.Wrapper}>
          <TransitionGroup>
            { this.renderAlerts() }
          </TransitionGroup>
        </div>
      </Portal>
    );
  }
}

const mapStateToProps = ({ globalAlert }) => ({ ...globalAlert });
export default connect(mapStateToProps, { clear })(GlobalAlertWrapper);
