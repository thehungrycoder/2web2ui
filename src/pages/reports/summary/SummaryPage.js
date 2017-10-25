import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import classnames from 'classnames';

import { refresh as refreshSummaryChart } from 'src/actions/summaryChart';
import { addFilter, refreshTypeaheadCache } from 'src/actions/reportFilters';

import { Page, Panel, Tabs } from '@sparkpost/matchbox';
import { Loading } from 'src/components';
import Filters from '../components/Filters';
import ShareModal from '../components/ShareModal';
import { List, MetricsModal, ChartGroup, ChartHeader } from './components';

import qs from 'query-string';
import moment from 'moment';
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

      // Checks if there is only one metric/filter
      const metricsList = typeof metrics === 'string' ? [metrics] : metrics;
      const filtersList = typeof filters === 'string' ? [filters] : filters;

      filtersList.forEach((filter) => {
        const parts = filter.split(':');
        const type = parts.shift();
        const value = parts.join(':');
        addFilter({ value, type });
      });

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
      from: moment(filters.from).utc().format(),
      to: moment(filters.to).utc().format(),
      metrics: chart.metrics.map((metric) => metric.key),
      filters: filters.activeList.map((filter) => `${filter.type}:${filter.value}`)
    };

    const search = `?${qs.stringify(options, { encode: false })}`;
    this.setState({ link: `${window.location.href.split('?')[0]}${search}` });
    history.replace({ pathname: '/reports/summary', search });
  }

  render() {
    const { chart } = this.props;
    const { scale, eventTime, link, metricsModal, shareModal } = this.state;

    return (
      <div>
        <Page title='Summary Report' />

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
      </div>
    );
  }
}

const mapStateToProps = ({ reportFilters, summaryChart }) => ({
  filters: reportFilters,
  chart: summaryChart
});
export default withRouter(connect(mapStateToProps, { refreshSummaryChart, refreshTypeaheadCache, addFilter })(SummaryReportPage));
