import React, { Component } from 'react';
import Error from './component/Error';
import ErrorTracker from 'src/helpers/errorTracker';
const primaryAction = {
  content: 'Reload Page',
  onClick: () => {
    window.location.reload();
  }
};

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, info) {
    this.setState({ hasError: true });
    ErrorTracker.report({ info }, error);
  }

  render() {
    const { showAction } = this.props;
    if (this.state.hasError) {
      return <Error primaryAction={showAction ? primaryAction : null } {...this.props} />;
    }

    return this.props.children;
  }
}
