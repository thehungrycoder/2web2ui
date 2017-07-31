import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { fetch as fetchMetrics } from '../../actions/metrics';
import LineChart from './components/LineChart';
import Layout from '../../components/Layout/Layout';
import { getQueryFromOptions, getDayLines, getLineChartFormatters } from '../../helpers/metrics';
import { Page, Icon, Datepicker } from '@sparkpost/matchbox';
import _ from 'lodash';
import moment from 'moment';
// import qs from 'query-string';

const displayDateFormat = 'YYYY-MM-DDTHH:mm';

class SummaryReportPage extends Component {
  constructor (props) {
    super(props);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDayClick = this.handleDayClick.bind(this);
    this.handleDayHover = this.handleDayHover.bind(this);

    const today = new Date();
    this.state = {
      options: {
        metrics: ['count_targeted', 'count_delivered', 'count_accepted', 'count_bounce'],
        from: moment(today).subtract(1, 'day').toDate(),
        to: today
      },
      datepicker: {
        selecting: false
      }
    };
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
    this.setState({ showDatePicker: false });
    this.refresh();
  }

  handleDayClick (selected) {
    const { selecting } = this.state.datepicker;
    if (selecting) {
      this.setState({ options: { ...this.state.options, to: selected } });
    } else {
      this.setState({ options: { ...this.state.options, from: selected } });
    }

    this.setState({ datepicker: { ...this.state.datepicker, selecting: !selecting } });
  }

  handleDayHover (entered) {
    const { selecting } = this.state.datepicker;
    if (selecting) {
      this.setState({ options: { ...this.state.options, to: entered } });
    }
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
    const { showDatePicker = false } = this.state;
    const { from, to } = this.state.options;
    return (
      <Layout.App>
        <Page title='Summary Report'/>

        {this.renderLoading()}

        <form onSubmit={this.handleSubmit}>
          {from &&
            <div>
              <input style={{width: '100%'}} value={`${from} to ${to}`} disabled />
              <Icon name='InsertChart' style={{ cursor: 'pointer' }} onClick={() => {
                this.setState({ showDatePicker: !showDatePicker });
              }} />
            </div>
          }

          {this.state.showDatePicker &&
            <div>
              <Datepicker
                numberOfMonths={2}
                fixedWeeks
                onDayClick={this.handleDayClick}
                onDayMouseEnter={this.handleDayHover}
                selectedDays={this.state.options}
              />
              <br/>
              <button type='submit'>Apply</button>
            </div>
          }

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
