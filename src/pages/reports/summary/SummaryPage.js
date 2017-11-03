import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import classnames from 'classnames';

import { refresh as refreshSummaryChart } from 'src/actions/summaryChart';
import { addFilter, refreshTypeaheadCache } from 'src/actions/reportFilters';
import { getShareLink, getFilterSearchOptions, getSearch, getFilterListFromSearch } from 'src/helpers/reports';

import { Page, Panel, Tabs } from '@sparkpost/matchbox';
import { Loading } from 'src/components';
import Filters from '../components/Filters';
import ShareModal from '../components/ShareModal';
import { List, MetricsModal, ChartGroup, ChartHeader } from './components';

import qs from 'query-string';
import styles from './SummaryPage.module.scss';

class SummaryReportPage extends Component {
  state = {
    shareModal: false,
    metricsModal: false,
    eventTime: 'real',
    scale: 'linear',
    link: ''
  }

  componentDidMount() {
    this.handleRefresh(this.parseSearch());
    this.props.refreshTypeaheadCache();
  }

  parseSearch() {
    const { location, addFilter } = this.props;
    let options = {};

    if (location.search) {
      const { from, to, metrics = [], filters = []} = qs.parse(location.search);

      // Checks if there is only one metric
      const metricsList = typeof metrics === 'string' ? [metrics] : metrics;

      getFilterListFromSearch(filters).forEach(addFilter);

      options = {
        metrics: metricsList,
        from: new Date(from),
        to: new Date(to)
      };
    }

    return options;
  }

  handleRefresh = (options) => {
    this.props.refreshSummaryChart(options).then(() => this.updateLink());
  }

  renderLoading() {
    const { chart } = this.props;
    if (chart.loading) {
      return <div className={styles.Loading}><Loading /></div>;
    }
  }

  handleMetricsApply = (selectedMetrics) => {
    this.setState({ metricsModal: false });
    this.handleRefresh({ metrics: selectedMetrics });
  }

  handleModalToggle = (modal) => {
    this.setState({ [modal]: !this.state[modal] });
  }

  handleTimeClick = (time) => {
    this.setState({ eventTime: time });
  }

  handleScaleClick = (scale) => {
    this.setState({ scale });
  }

  updateLink = () => {
    const { filters, chart, history } = this.props;

    const options = {
      metrics: chart.metrics.map((metric) => metric.key),
      ...getFilterSearchOptions(filters)
    };

    const link = getShareLink(options);
    const search = getSearch(options);

    this.setState({ link });
    history.replace({ pathname: '/reports/summary', search });
  }

  render() {
    const { chart } = this.props;
    const { scale, eventTime, link, metricsModal, shareModal } = this.state;

    return (
      <Page title='Summary Report'>
        <Filters refresh={this.handleRefresh} onShare={() => this.handleModalToggle('shareModal')} />

        <Panel>
          <Panel.Section className={classnames(styles.ChartSection, chart.loading && styles.pending)}>
            <ChartHeader
              selectedMetrics={chart.metrics}
              selectedTime={eventTime}
              selectedScale={scale}
              onScaleClick={this.handleScaleClick}
              onTimeClick={this.handleTimeClick}
              onMetricsToggle={() => this.handleModalToggle('metricsModal')}
            />
            <ChartGroup {...chart} yScale={scale} />
          </Panel.Section>

          {this.renderLoading()}
        </Panel>

        <Tabs selected={0} tabs={[ { content: 'Domains' }, { content: 'Campaigns' }, { content: 'Templates' } ]}/>
        <Panel><List /></Panel>

        <ShareModal
          open={shareModal}
          handleToggle={() => this.handleModalToggle('shareModal')}
          link={link} />
        <MetricsModal
          selectedMetrics={chart.metrics}
          open={metricsModal}
          onCancel={() => this.handleModalToggle('metricsModal')}
          onSubmit={this.handleMetricsApply} />
      </Page>
    );
  }
}

const mapStateToProps = ({ reportFilters, summaryChart }) => ({
  filters: reportFilters,
  chart: summaryChart
});
export default withRouter(connect(mapStateToProps, { refreshSummaryChart, refreshTypeaheadCache, addFilter })(SummaryReportPage));
