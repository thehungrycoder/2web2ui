import React, { Component } from 'react';
import { Banner, Button } from '@sparkpost/matchbox';

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
      status = 'warning'
    } = this.props;
    const { showErrorDetails } = this.state;
    const buttonText = showErrorDetails ? 'Hide Error Details' : 'Show Error Details';

    return (
      <Banner status={status} title={title}>
        <p>{message}</p>

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
