import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import classnames from 'classnames';

import { refresh as refreshSummaryChart } from 'actions/summaryChart';
import { refreshTypeaheadCache } from 'actions/reportFilters';

import { Page, Button, Panel, Tabs, Tooltip, Grid } from '@sparkpost/matchbox';
import { Layout, Loading } from 'components';
import Filters from '../components/Filters';
import ShareModal from '../components/ShareModal';
import List from './components/List';
import MetricsModal from './components/MetricsModal';
import Legend from './components/Legend';
import ChartGroup from './components/ChartGroup';

import qs from 'query-string';
import moment from 'moment';
import styles from './SummaryPage.module.scss';

class SummaryReportPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showShare: false,
      showMetrics: false,
      eventTime: true,
      scale: 'linear'
    };
  }

  componentWillMount() {
    const { location } = this.props;
    let options = {};

    if (location.search) {
      const { from, to, metrics } = qs.parse(location.search);
      options = {
        metrics,
        from: (from instanceof Date) ? from : new Date(from),
        to: (to instanceof Date) ? to : new Date(to)
      };
    }

    this.props.refreshSummaryChart(options);
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

  handleShareToggle = () => {
    this.setState({ showShare: !this.state.showShare });
  }

  handleTimeToggle = () => {
    this.setState({ eventTime: !this.state.eventTime });
  }

  renderScaleButton(scale, label) {
    return <Button size='small' primary={scale === this.state.scale} onClick={() => this.setState({ scale })}>{label}</Button>;
  }

  getShareableLink = () => {
    const { filters, chart } = this.props;
    const options = {
      from: moment(filters.from).utc().format(),
      to: moment(filters.to).utc().format(),
      metrics: chart.metrics.map((metric) => metric.key)
    };
    return `${window.location.href.split('?')[0]}?${qs.stringify(options, { encode: false })}`;
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
    const { metricsData, chart } = this.props;
    const { scale } = this.state;

    const link = this.getShareableLink();

    return (
      <Layout.App>
        <Page title='Summary Report' />

        <Filters
          refresh={this.props.refreshSummaryChart}
          onShare={this.handleShareToggle} />

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

        <ShareModal
          open={this.state.showShare}
          handleToggle={this.handleShareToggle}
          link={link} />
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
