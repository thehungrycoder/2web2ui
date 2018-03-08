import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Snackbar } from '@sparkpost/matchbox';
import styles from './Alert.module.scss';

class Alert extends Component {
  static propTypes = {
    autoDismiss: PropTypes.bool,
    message: PropTypes.string.isRequired,
    type: PropTypes.string,
    details: PropTypes.string,
    timeoutInterval: PropTypes.number,
    onDismiss: PropTypes.func.isRequired
  };

  static defaultProps = {
    autoDismiss: true,
    type: 'default',
    timeoutInterval: 3000
  }

  state = {
    showDetails: false
  }

  timeout = null;

  componentDidMount() {
    if (this.props.autoDismiss) {
      this.refreshTimeout();
    }
  }

  handleDismiss = () => {
    this.props.onDismiss();
  }

  refreshTimeout = () => {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(this.handleDismiss, this.props.timeoutInterval);
  }

  handleDetails = () => {
    if (this.props.autoDismiss) {
      this.refreshTimeout();
    }
    this.setState({ showDetails: true });
  }

  renderMessage() {
    const { message, details } = this.props;
    const { showDetails } = this.state;

    const detailsLink = details && !showDetails
      ? <a onClick={this.handleDetails}>View Details</a>
      : null;

    const markup = showDetails
      ? <div>{ details }</div>
      : <div>{ message } <span className={styles.Details}>{detailsLink}</span></div>;

    return <div>{ markup }</div>;
  }

  render() {
    const { type, maxWidth } = this.props;

    return <Snackbar status={type} onDismiss={this.handleDismiss} maxWidth={maxWidth}>{this.renderMessage()}</Snackbar>;
  }
}

export default Alert;
