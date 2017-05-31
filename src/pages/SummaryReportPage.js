import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { fetch as fetchMetrics } from '../actions/metrics';
import { Line as LineChart } from 'react-chartjs-2';
import Layout from '../components/Layout/Layout';
import _ from 'lodash';
import moment from 'moment';

const timeUnit = 'day';
const options = {
  tooltips: {
    mode: 'index',
    intersect: false,
    callbacks: {
      title: (t) => moment(t[0].xLabel).format('MMM D HH:MM')
    }
  },
  elements: {
    line: {
      tension: 0
    }
  },
  scales: {
    xAxes: [{
      type: 'time',
      scaleLabel: {
        display: true,
        labelString: `Time (by ${timeUnit})`
      },
      time: {
        unit: timeUnit,
        round: timeUnit,
        displayFormats: {
          hour: 'MMM D HH:MM'
        }
      }
    }],
    yAxes: [{
      scaleLabel: {
        display: true,
        labelString: 'Count'
      },
      ticks: {
        beginAtZero: true
      }
    }]
  }
};

class SummaryReportPage extends Component {
  state = {
    queryParams: {}
  };

  componentWillMount () {
    this.props.fetchMetrics('deliverability/time-series', {
      metrics: 'count_targeted,count_delivered,count_accepted,count_bounce',
      precision: 'day'
    });
  }

  refresh () {
    this.props.fetchMetrics('deliverability/time-series', {
      metrics: 'count_targeted,count_delivered,count_accepted,count_bounce',
      ...this.state.queryParams,
      precision: 'day'
    });
  }

  render () {
    if (!this.props.metrics.length || this.props.metrics.loading) {
      return null;
    }

    // console.log(JSON.stringify(this.props.metrics, null, 2));

    const data = this.props.metrics.reduce((acc, item) => {
      acc.labels.push(item.ts);
      delete item.ts;

      Object.keys(item).forEach((k) => {
        if (!acc.datasets[k]) {
          acc.datasets[k] = {
            label: k.replace('count_', ''),
            backgroundColor: 'transparent',
            borderWidth: '2',
            data: []
          };
        }
        acc.datasets[k].data.push(item[k]);
      });

      return acc;
    }, { labels: [], datasets: {} });

    // convert datasets object to array
    data.datasets = _.values(data.datasets);

    data.datasets[0].borderColor = data.datasets[0].pointBackgroundColor = '#37aadc';
    data.datasets[1].borderColor = data.datasets[1].pointBackgroundColor = '#9bcd5a';
    data.datasets[2].borderColor = data.datasets[2].pointBackgroundColor = '#b70c9e';
    data.datasets[3].borderColor = data.datasets[3].pointBackgroundColor = '#e3af00';

    console.log(JSON.stringify(data, null, 2));

    return (
      <Layout.App>
        <h1>Summary Report</h1>
        <p>From: {this.state.queryParams.from || 'not specified'}</p>
        <form>
          <input type="datetime" placeholder="Start Date/Time" name="from" onChange={(e) => {
            const { queryParams } = this.state;
            this.setState({ queryParams: { ...queryParams, from: moment(e.target.value).format('YYYY-MM-DDTHH:MM') } });
          }} />
          <button onClick={(e) => {
            e.preventDefault();
            this.refresh();
          }}>Refresh data</button>
        </form>
        <LineChart
          data={data}
          options={options}
          width={800}
        >
        </LineChart>
      </Layout.App>
    );
  }
}

export default withRouter(connect(({ metrics }) => ({ metrics }), { fetchMetrics })(SummaryReportPage));
