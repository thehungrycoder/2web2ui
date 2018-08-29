import React, { Component } from 'react';
import { EmptyState } from '@sparkpost/matchbox';
import { Generic } from 'src/components/images';
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

  componentDidCatch(error) {
    this.setState({ hasError: true });

    // Must manually report errors, React swallows errors in "production" builds
    ErrorTracker.report(error);
  }

  render() {
    if (this.state.hasError) {
      return <div style={{ margin: '0 auto', maxWidth: 1080 }}>
        <EmptyState
          title='Sorry, something went wrong'
          image={Generic}
          primaryAction={primaryAction}
        >
          <p>We're having some technical issues. Our engineers have been notified and are working on getting this
            fixed.</p>
        </EmptyState>
      </div>;
    }

    return this.props.children;
  }
}
