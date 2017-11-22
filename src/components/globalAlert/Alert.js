import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Snackbar } from '@sparkpost/matchbox';

class Alert extends Component {
  static PropTypes = {
    autoDismiss: PropTypes.bool,
    message: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['default', 'success', 'error', 'danger']),
    details: PropTypes.string,
    timeout: PropTypes.number,
    onDismiss: PropTypes.func.isRequired
  };

  static defaultProps = {
    autoDismiss: true,
    type: 'default',
    timeout: 15000
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
    this.timeout = setTimeout(this.handleDismiss, this.props.timeout);
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
     : <div>{ message } { detailsLink }</div>;

    return <div>{ markup }</div>;
  }

  render() {
    const { type } = this.props;
    const status = type === 'error' ? 'danger' : type;

    return <Snackbar status={status} onDismiss={this.handleDismiss}>{ this.renderMessage() }</Snackbar>;
  }
}

export default Alert;
