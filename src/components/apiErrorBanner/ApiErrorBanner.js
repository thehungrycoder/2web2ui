import React, { Component } from 'react';
import { Banner, Button } from '@sparkpost/matchbox';

const methodToText = {
  GET: 'loading',
  PUT: 'updating',
  DELETE: 'deleting',
  POST: 'creating'
};

const craftMessage = (method, resource) => {
  if (!method || !resource) {
    return 'Sorry, there was an issue.';
  }

  const message = `Sorry, there was an issue ${methodToText[method]} your ${resource}.`;
  return message;
};

export default class ApiErrorBanner extends Component {
  state = {
    showErrorDetails: false
  };

  render() {
    const {
      message,
      errorDetails,
      reload = false,
      title = 'An error occurred',
      status = 'warning',
      error = { payload: {}, meta: {}}
    } = this.props;

    const { showErrorDetails } = this.state;
    const { payload, meta, resource } = error;
    const buttonText = showErrorDetails ? 'Hide Error Details' : 'Show Error Details';
    const showDetailsButton = errorDetails || payload.message;

    return (
      <Banner status={status} title={title}>
        <p>{message || craftMessage(meta.method, resource)}</p>

        {reload && <Button outline={true} onClick={() => reload()} style={{ marginRight: '10px' }}>
          Try Again
        </Button>}
        {showDetailsButton && <Button outline={true} onClick={() => this.setState({ showErrorDetails: !showErrorDetails })}>
          {buttonText}
        </Button>}

        {showErrorDetails && <p style={{ marginTop: '20px' }}><strong>Details:</strong> {errorDetails || payload.message}</p>}
      </Banner>
    );
  }
}
