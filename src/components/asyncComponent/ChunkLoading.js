import React, { Component } from 'react';
import { connect } from 'react-redux';
import { showAlert } from 'src/actions/globalAlert';
import { Loading } from 'src/components';

export class ChunkLoading extends Component {

  handleRetry() {
    window.location.reload(true);
  }

  componentDidUpdate({ error: prevError }) {
    const { error, showAlert } = this.props;

    if (!prevError && error) {
      showAlert({
        message: 'Error loading page',
        type: 'error',
        maxWidth: 800,
        action: {
          content: 'Retry',
          onClick: this.handleRetry
        },
        dedupeId: 'CHUNK_ERROR'
      });
    }
  }

  render() {
    const { LoadingComponent = Loading, pastDelay } = this.props;

    // If loading has taken more than 200 milliseconds
    if (pastDelay) {
      return <LoadingComponent />;
    }

    // When the loader has just started
    return null;
  }
}

export default connect(null, { showAlert })(ChunkLoading);
