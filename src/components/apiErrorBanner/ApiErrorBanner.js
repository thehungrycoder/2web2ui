import React, { Component } from 'react';
import { Banner, Button } from '@sparkpost/matchbox';

const actionToText = {
  GET: 'loading',
  PUT: 'updating',
  DELETE: 'deleting',
  POST: 'creating'
};

const craftMessage = (resource, action) => {
  if (!resource || !action) {
    return null;
  }

  const message = `Sorry, there was an issue ${actionToText[action]} your ${resource}`;
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
      action,
      resource
    } = this.props;
    const { showErrorDetails } = this.state;
    const buttonText = showErrorDetails ? 'Hide Error Details' : 'Show Error Details';

    return (
      <Banner status={status} title={title}>
        <p>{message || craftMessage(resource, action)}</p>

        {reload && <Button outline={true} onClick={() => reload()} style={{ marginRight: '10px' }}>
          Try Again
        </Button>}
        {errorDetails && <Button outline={true} onClick={() => this.setState({ showErrorDetails: !showErrorDetails })}>
          {buttonText}
        </Button>}

        {showErrorDetails && <p style={{ marginTop: '20px' }}><strong>Details:</strong> {errorDetails}</p>}
      </Banner>
    );
  }
}
