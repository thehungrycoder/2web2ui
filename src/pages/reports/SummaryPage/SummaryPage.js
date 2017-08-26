/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import classnames from 'classnames';

import { fetch as fetchMetrics } from 'actions/metrics';
import { getQueryFromOptions, getDayLines, getLineChartFormatters } from 'helpers/metrics';

import { Page, Button, Panel, Tabs, Tooltip, Grid } from '@sparkpost/matchbox';
import Layout from 'components/Layout/Layout';
import { Loading } from 'components/Loading/Loading';

import Filters from '../components/Filters';
import LineChart from './components/LineChart';
import List from './components/List';
import MetricsModal from './components/MetricsModal';
import Legend from './components/Legend';

import { list as METRICS_LIST } from 'config/metrics';

import _ from 'lodash';
import styles from './SummaryPage.module.scss';
// import qs from 'query-string';

class SummaryReportPage extends Component {
  // colors = ['#37aadc', '#9bcd5a', '#b70c9e', '#e3af00', '#6D39A1'];
  COLORS = ['#20578E', '#F38415', '#45A6FF', '#FFD300', '#41B5AB', '#6BEAA8'];

  constructor(props) {
    super(props);

    this.state = {
      showMetrics: false,
      eventTime: true,
      options: {
        metrics: ['count_targeted', 'count_rendered', 'count_accepted', 'count_bounce']
      }
    };
  }

  componentWillMount() {
    this.refresh();
  }

  renderLoading() {
    const { metricsData } = this.props;
    if (metricsData.pending) {
      return <div className={styles.Loading}><Loading /></div>;
    }
  }

  refresh = () => {
    const { to, from } = this.props.filter;
    const { chartOptions, options } = this.state;

    if (this.props.metricsData.pending || (chartOptions === options)) {
      return;
    }

    const query = getQueryFromOptions({ ...options, to, from });
    let colorIndex = 0;

    const metrics = this.state.options.metrics.map((metric) => ({
      name: metric,
      stroke: this.COLORS[colorIndex++],
      label: _.find(METRICS_LIST, { key: metric }).label
    }));

    this.props.fetchMetrics('deliverability/time-series', query)
      .then(() => this.setState({
        chartOptions: {
          ...options,
          metrics,
          precision: query.precision
        }
      }));
  }

  createDayReferenceLines() {
    const { results = {}} = this.props.metricsData;
    const { chartOptions } = this.state;

    return getDayLines(results, chartOptions).map(({ ts }) => ({
      key: ts,
      x: ts,
      stroke: '#bbb',
      strokeWidth: 2
    }));
  }

  renderChart() {
    const { results = [], pending } = this.props.metricsData;
    const { chartOptions = false } = this.state;
    const { metrics = []} = chartOptions;

    if (!results.length || !chartOptions) {
      return null;
    }

    return (
      <LineChart
        data={results}
        lines={metrics.map((metric) => ({
          key: metric.name,
          dataKey: metric.name,
          name: metric.label,
          stroke: pending ? '#f8f8f8' : metric.stroke
        }))}
        {...getLineChartFormatters(chartOptions)}
        referenceLines={this.createDayReferenceLines()}
      />
    );
  }

  handleMetricsApply = (selectedMetrics) => {
    this.setState({
      showMetrics: false,
      options: { metrics: selectedMetrics }
    }, () => this.refresh());
  }

  handleMetricsToggle = () => {
    this.setState({ showMetrics: !this.state.showMetrics });
  }

  handleTimeToggle = () => {
    this.setState({ eventTime: !this.state.eventTime });
  }

  renderTimeMode() {
    const { eventTime } = this.state;

    return eventTime
    ? <Tooltip content='Sort events by injection time'>
        <Button onClick={this.handleTimeToggle} className={styles.ButtonSpacer} size='small'>Event Time</Button>
      </Tooltip>
    : <Tooltip content='Sort events by event time'>
        <Button onClick={this.handleTimeToggle} className={styles.ButtonSpacer} size='small'>Injection Time</Button>
      </Tooltip>;
  }

  render() {
    const { metricsData } = this.props;
    const { chartOptions = false } = this.state;

    return (
      <Layout.App>
        <Page title='Summary Report' />

        <Filters refresh={this.refresh}/>

        <Panel>
          <Panel.Section className={classnames(styles.ChartSection, metricsData.pending && styles.pending)}>

            {/* TODO: maybe move Legend and Controls into own component? */}
            <Grid className={styles.ChartHeader}>
              <Grid.Column xs={12} md={7} lg={6}>
                <Legend metrics={chartOptions.metrics}/>
              </Grid.Column>
              <Grid.Column xs={12} md={5} lg={6}>
                <div className={styles.Controls}>
                  <Button size='small' onClick={this.handleMetricsToggle}>Select Metrics</Button>
                  {this.renderTimeMode()}
                  <Button.Group className={styles.ButtonSpacer}>
                    <Button size='small' primary>Linear</Button>
                    <Button size='small'>Log</Button>
                  </Button.Group>
                </div>
              </Grid.Column>
            </Grid>

            {this.renderChart()}
          </Panel.Section>

          {this.renderLoading()}
        </Panel>

        <Tabs
          selected={0}
          tabs={[
            { content: 'Domains' },
            { content: 'Campaigns' },
            { content: 'Templates' }
          ]}/>
        <Panel>
          <List />
        </Panel>
        <MetricsModal
          selectedMetrics={this.state.options.metrics}
          open={this.state.showMetrics}
          handleToggle={this.handleMetricsToggle}
          handleApply={this.handleMetricsApply} />
      </Layout.App>
    );
  }
}

const mapStateToProps = ({ metrics, reportFilters }) => ({ metricsData: metrics, filter: reportFilters });
export default withRouter(connect(mapStateToProps, { fetchMetrics })(SummaryReportPage));
