import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { fetch as fetchMetrics } from '../../actions/metrics';
import LineChart from './components/LineChart';
import Layout from '../../components/Layout/Layout';
import { getQueryFromOptions, getDayLines, getLineChartFormatters } from '../../helpers/metrics';
import { Page, Icon } from '@sparkpost/matchbox';
import _ from 'lodash';
// import qs from 'query-string';

class SummaryReportPage extends Component {
  state = {
    options: {
      metrics: ['count_targeted', 'count_delivered', 'count_accepted', 'count_bounce']
    }
  };

  constructor (props) {
    super(props);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount () {
    this.refresh();
  }

  renderLoading () {
    const { metricsData } = this.props;
    if (metricsData.pending) {
      return <p><Icon name='Refresh' /> Loading metrics...</p>;
    }
  }

  handleInputChange ({ target }) {
    const { name, value } = target;
    this.setState({
      options: {
        ...this.state.options,
        [name]: value
      }
    });
  }

  handleSubmit ({ preventDefault }) {
    preventDefault();
    this.refresh();
  }

  refresh () {
    if (this.props.metricsData.pending || (this.state.chartOptions === this.state.options)) {
      return;
    }
    this.setState({ refreshing: true });
    const query = getQueryFromOptions(this.state.options);

    this.props.fetchMetrics('deliverability/time-series', query)
      .then(() => this.setState({ chartOptions: {
        ...this.state.options,
        precision: query.precision
      } }));
  }

  createDayReferenceLines () {
    const { results = {} } = this.props.metricsData;
    const { chartOptions } = this.state;

    return getDayLines(results, chartOptions).map(({ ts }) => ({
      key: ts,
      x: ts,
      stroke: '#bbb',
      strokeWidth: 2
    }));
  }

  renderChart () {
    const { results = [] } = this.props.metricsData;
    const { chartOptions = false } = this.state;
    const { metrics = [] } = chartOptions;

    if (!results.length || !chartOptions) {
      return null;
    }

    return (
      <LineChart
        data={results}
        lines={metrics.map((metric) => ({
          key: metric,
          dataKey: metric,
          name: formatMetricLabel(metric)
        }))}
        {...getLineChartFormatters(chartOptions)}
        referenceLines={this.createDayReferenceLines()}
      />
    );
  }

  render () {
    return (
      <Layout.App>
        <Page title='Summary Report'/>

        {this.renderLoading()}

        <form onSubmit={this.handleSubmit}>
          <input name='from' onChange={this.handleInputChange} placeholder='From' />
          <input name='to' onChange={this.handleInputChange} placeholder='To' />
          <button type='submit'>Refresh</button>
        </form>

        {this.renderChart()}

      </Layout.App>
    );
  }
}

// this will be replaced with proper metrics config
function formatMetricLabel (name) {
  return _.startCase(name.replace(/^count_/, ''));
}

export default withRouter(connect(({ metrics }) => ({ metricsData: metrics }), { fetchMetrics })(SummaryReportPage));
