/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import classnames from 'classnames';

import { refresh as refreshSummaryChart } from 'actions/summaryChart';
import { refreshTypeaheadCache } from 'actions/reportFilters';
import { getQueryFromOptions } from 'helpers/metrics';

import { Page, Button, Panel, Tabs, Tooltip, Grid } from '@sparkpost/matchbox';
import { Layout, Loading } from 'components';
import Filters from '../components/Filters';
import List from './components/List';
import MetricsModal from './components/MetricsModal';
import Legend from './components/Legend';
import ChartGroup from './components/ChartGroup';

import { list as METRICS_LIST } from 'config/metrics';

import _ from 'lodash';
import styles from './SummaryPage.module.scss';

class SummaryReportPage extends Component {
  COLORS = ['#20578E', '#F38415', '#45A6FF', '#FFD300', '#41B5AB', '#6BEAA8'];

  constructor(props) {
    super(props);

    this.state = {
      showMetrics: false,
      eventTime: true,
      scale: 'linear',
      options: {
        metrics: ['count_targeted', 'count_rendered', 'count_accepted', 'count_bounce']
      }
    };
  }

  componentWillMount() {
    this.props.refreshSummaryChart();
    this.props.refreshTypeaheadCache();
  }

  renderLoading() {
    const { chart } = this.props;
    if (chart.loading) {
      return <div className={styles.Loading}><Loading /></div>;
    }
  }

  handleMetricsApply = (selectedMetrics) => {
    this.setState({ showMetrics: false });
    this.props.refreshSummaryChart({ metrics: selectedMetrics });
  }

  handleMetricsToggle = () => {
    this.setState({ showMetrics: !this.state.showMetrics });
  }

  handleTimeToggle = () => {
    this.setState({ eventTime: !this.state.eventTime });
  }

  renderScaleButton(scale, label) {
    return <Button size='small' primary={scale === this.state.scale} onClick={() => this.setState({ scale })}>{label}</Button>
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
    const { chart } = this.props;
    const { scale } = this.state;

    return (
      <Layout.App>
        <Page title='Summary Report' />

        <Filters refresh={this.props.refreshSummaryChart}/>

        <Panel>
          <Panel.Section className={classnames(styles.ChartSection, chart.loading && styles.pending)}>

            {/* TODO: maybe move Legend and Controls into own component? */}
            <Grid className={styles.ChartHeader}>
              <Grid.Column xs={12} md={7} lg={6}>
                <Legend metrics={chart.metrics}/>
              </Grid.Column>
              <Grid.Column xs={12} md={5} lg={6}>
                <div className={styles.Controls}>
                  <Button size='small' onClick={this.handleMetricsToggle}>Select Metrics</Button>
                  {this.renderTimeMode()}
                  <Button.Group className={styles.ButtonSpacer}>
                    {this.renderScaleButton('linear', 'Linear')}
                    {this.renderScaleButton('log', 'Log')}
                    {this.renderScaleButton('sqrt', '√ Sq Rt')}
                  </Button.Group>
                </div>
              </Grid.Column>
            </Grid>

            <ChartGroup {...chart} yScale={scale} />
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
          selectedMetrics={chart.metrics}
          open={this.state.showMetrics}
          onCancel={this.handleMetricsToggle}
          onSubmit={this.handleMetricsApply} />
      </Layout.App>
    );
  }
}

const mapStateToProps = ({ reportFilters, summaryChart }) => ({
  filters: reportFilters,
  chart: summaryChart
});
export default withRouter(connect(mapStateToProps, { refreshSummaryChart, refreshTypeaheadCache })(SummaryReportPage));
