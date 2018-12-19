import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { getSpamHits } from 'src/actions/signals';
import _ from 'lodash';

function withSpamTrapDetails(WrappedComponent) {
  class WithSpamTrapDetails extends Component {
    componentDidMount() {
      const { getSpamHits, facet, facetId } = this.props;
      getSpamHits({ facet, facetId });
    }

    componentDidUpdate(prevProps) {
      const { getSpamHits, facet, facetId, filters } = this.props;
      const prevRange = prevProps.filters.relativeRange;
      const nextRange = filters.relativeRange;

      // Refresh when date range changes
      if (prevRange !== nextRange) {
        getSpamHits({ facet, facetId });
      }
    }

    render() {
      const { details, facet, facetId, selected } = this.props;

      // Calculate gap here to share with preview and details
      const gap = details.data && details.data.length > 14 ? 0.1 : 0.5;

      return (
        <WrappedComponent {...details} facet={facet} facetId={facetId} gap={gap} selected={selected}/>
      );
    }
  }

  WithSpamTrapDetails.displayName = `WithSpamTrapDetails(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  const mapStateToProps = (state, props) => ({
    details: state.signals.spamTraps.details,
    filters: state.signalOptions,
    facet: props.match.params.facet,
    facetId: props.match.params.facetId,
    selected: _.get(props, 'location.state.date')
  });

  return withRouter(connect(mapStateToProps, { getSpamHits })(WithSpamTrapDetails));
}

export default withSpamTrapDetails;
