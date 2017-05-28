import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { fetch as fetchMetrics } from '../actions/metrics';

class SummaryReportPage extends Component {
  componentWillMount () {
    this.props.fetchMetrics('deliverability/time-series');
  }
  render () {
    if (this.props.metrics && !this.props.metrics.loading) {
      console.log(JSON.stringify(this.props.metrics, null, 2));
    }
    return (
      <div>
        <h1>Summary Report</h1>
      </div>
    );
  }
}

export default withRouter(connect(({ metrics }) => ({ metrics }), { fetchMetrics })(SummaryReportPage));
