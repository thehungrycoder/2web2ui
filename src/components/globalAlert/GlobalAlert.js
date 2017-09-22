import React, { Component } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { clear } from 'actions/globalAlert';
import { Snackbar } from '@sparkpost/matchbox';

import styles from './GlobalAlert.module.scss';

export class GlobalAlert extends Component {
  state = {
    show: false, // Controls the .show css class
    showDetails: false
  }

  autoClose = null;

  handleDismiss() {
    clearTimeout(this.autoClose);
    this.setState({ show: false });

    setTimeout(() => {
      this.setState({ showDetails: false });
      this.props.clear();
    }, 200); // Wait for transition out before killing
  }

  componentWillReceiveProps({ message }) {
    if (message) {
      this.setState({ show: true });
      clearTimeout(this.autoClose);
      this.autoClose = setTimeout(() => this.handleDismiss(), 10000);
    }
  }

  renderMessage() {
    const { message, details } = this.props;
    const { showDetails } = this.state;

    const detailsLink = details && !showDetails
      ? <a onClick={() => this.setState({ showDetails: true })}>View Details</a>
      : null;

    const markup = showDetails
     ? <div>{ details }</div>
     : <div>{ message } { detailsLink }</div>;

    return <div>{ markup }</div>;
  }

  render() {
    const { type } = this.props;
    const status = type === 'error' ? 'danger' : type; // TODO change type strings in MB

    const classes = classnames(
      styles.GlobalAlert,
      this.state.show && styles.show
    );

    return (
      <div className={classes}>
        <Snackbar status={status} onDismiss={() => this.handleDismiss()} >
          { this.renderMessage() }
        </Snackbar>
      </div>
    );
  }
}

const mapStateToProps = ({ globalAlert }) => ({ ...globalAlert });
export default connect(mapStateToProps, { clear })(GlobalAlert);
