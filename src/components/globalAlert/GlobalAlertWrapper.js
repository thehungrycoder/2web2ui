import React, { Component } from 'react';
import { connect } from 'react-redux';
import TransitionGroup from 'react-transition-group/TransitionGroup';
import { clear } from 'src/actions/globalAlert';
import { Portal, Snackbar } from '@sparkpost/matchbox';

import Animator from './Animator';
import Alert from './Alert';
import styles from './GlobalAlert.module.scss';

export const GlobalAlertWrapper = ({
  alerts,
  clear
}) => (
  <Portal containerId='alert-portal'>
    <div className={styles.Wrapper}>
      <TransitionGroup>
        { alerts.map((alert, i) => (
          <Animator key={`${alert.message}-${alert.date}`}>
            <div className={styles.Alert}>
              <Alert onDismiss={() => clear(i)} {...alert}></Alert>
            </div>
          </Animator>
        ))}
      </TransitionGroup>
    </div>
  </Portal>
);


const mapStateToProps = ({ globalAlert }) => ({ ...globalAlert });
export default connect(mapStateToProps, { clear })(GlobalAlertWrapper);
