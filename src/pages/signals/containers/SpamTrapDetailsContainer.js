import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { getSpamHits } from 'src/actions/signals';
import { selectSpamHitsDetails, getSelectedDateFromRouter } from 'src/selectors/signals';

export class WithSpamTrapDetails extends Component {
  componentDidMount() {
    const { getSpamHits, facet, facetId, filters } = this.props;
    getSpamHits({
      facet,
      filter: facetId,
      relativeRange: filters.relativeRange
    });
  }

  componentDidUpdate(prevProps) {
    const { getSpamHits, facet, facetId, filters } = this.props;
    const prevRange = prevProps.filters.relativeRange;
    const nextRange = filters.relativeRange;

    // Refresh when date range changes
    if (prevRange !== nextRange) {
      getSpamHits({ facet, filter: facetId, relativeRange: nextRange });
    }
  }

  render() {
    const {
      component: WrappedComponent,
      details,
      facet,
      facetId,
      selected
    } = this.props;

    // Calculate gap here to share with preview and details
    const gap = details.history && details.history.length > 14 ? 0.1 : 0.5;

    return (
      <WrappedComponent {...details} facet={facet} facetId={facetId} gap={gap} selected={selected}/>
    );
  }
}

/**
 * Provides Spam Trap details to the provided component
 * @example
 *   export default withSpamTrapDetails(MyComponent);
 */
function withSpamTrapDetails(WrappedComponent) {
  const Wrapper = (props) => (
    <WithSpamTrapDetails {...props} component={WrappedComponent} />
  );

  Wrapper.displayName = `WithSpamTrapDetails(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  const mapStateToProps = (state, props) => ({
    ...selectSpamHitsDetails(state, props),
    filters: state.signalOptions,
    selected: getSelectedDateFromRouter(state)
  });

  return withRouter(connect(mapStateToProps, { getSpamHits })(Wrapper));
}

export default withSpamTrapDetails;
