import React, { Component } from 'react';
import { EmptyState } from '@sparkpost/matchbox';
import ErrorTracker from 'src/helpers/errorTracker';

const primaryAction = {
  content: 'Reload Page',
  onClick: () => {
    window.location.reload(true);
  }
};

export default class ErrorBoundary extends Component {
  state = {
    hasError: false
  }

  componentDidCatch (error, info) {
    this.setState({ hasError: true });
    ErrorTracker.report({ info }, error);
  }

  render () {
    if (this.state.hasError) {
      return <EmptyState
        title='Sorry, something went wrong'
        image='Generic'
        primaryAction={primaryAction}
      >
        <p>We're having some technical issues. Our engineers have been notified and are working on getting this fixed.</p>
      </EmptyState>;
    }

    return this.props.children;
  }
}
