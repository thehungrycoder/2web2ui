import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { getSpamHits } from 'src/actions/signals';
import { selectSpamHitsDetails } from 'src/selectors/signals';
import { getDateTicks } from 'src/helpers/date';

export class WithSpamTrapDetails extends Component {
  componentDidMount() {
    const { getSpamHits, facet, facetId, filters, subaccountId } = this.props;
    getSpamHits({
      facet,
      filter: facetId,
      relativeRange: filters.relativeRange,
      subaccount: subaccountId
    });
  }

  componentDidUpdate(prevProps) {
    const { getSpamHits, facet, facetId, filters, subaccountId } = this.props;
    const prevRange = prevProps.filters.relativeRange;
    const nextRange = filters.relativeRange;

    // Refresh when date range changes
    if (prevRange !== nextRange) {
      getSpamHits({
        facet,
        filter: facetId,
        relativeRange: nextRange,
        subaccount: subaccountId
      });
    }
  }

  render() {
    const {
      component: WrappedComponent,
      details,
      facet,
      facetId,
      filters
    } = this.props;

    // Calculate gap here to share with preview and details
    const gap = details.data && details.data.length > 14 ? 0.2 : 0.5;

    return (
      <WrappedComponent {...details} facet={facet} facetId={facetId} gap={gap} xTicks={getDateTicks(filters.relativeRange)} />
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
    filters: state.signalOptions
  });

  return withRouter(connect(mapStateToProps, { getSpamHits })(Wrapper));
}

export default withSpamTrapDetails;
