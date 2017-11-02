import React from 'react';
import { connect } from 'react-redux';
import { Panel } from '@sparkpost/matchbox';

// TODO finish this
const Header = ({ aggregates, loading }) => {
  if (loading || !aggregates) {
    return null;
  }

  const bounceRate = 100 * (aggregates.countBounce / aggregates.countTargeted);

  return (
    <Panel sectioned>
      <h3>{ bounceRate.toFixed(2) }%</h3>
      <p>Bounce Rate</p>
      <p>{ aggregates.countBounce.toLocaleString() } Bounces of { aggregates.countTargeted.toLocaleString() } Targeted</p>
    </Panel>
  );
};

const mapStateToProps = (state) => ({
  loading: state.bounceReport.aggregatesLoading,
  aggregates: state.bounceReport.aggregates
});
export default connect(mapStateToProps, {})(Header);
