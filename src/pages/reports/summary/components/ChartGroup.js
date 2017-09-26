import React, { Component } from 'react';
import _ from 'lodash';
import { getDayLines, getLineChartFormatters } from 'src/helpers/chart';
import LineChart from './LineChart';
import METRICS_UNIT_CONFIG from 'src/config/metrics-units';
const DEFAULT_UNIT = 'number';

function getUniqueUnits(metrics) {
  return _.uniq(metrics.map(({ unit = DEFAULT_UNIT }) => unit));
}

export default class ChartGroup extends Component {

  createDayReferenceLines() {
    const { data, precision } = this.props;

    return getDayLines(data, precision).map(({ ts }) => ({
      key: ts,
      x: ts,
      stroke: '#bbb',
      strokeWidth: 2
    }));
  }

  render() {
    const { data = [], metrics, loading, precision, yScale } = this.props;

    if (!data.length || !metrics) {
      return null;
    }

    const formatters = getLineChartFormatters(precision);
    const referenceLines = this.createDayReferenceLines();
    const charts = getUniqueUnits(metrics).map((unit) => ({
      metrics: metrics.filter((metric) => metric.unit === unit),
      ...METRICS_UNIT_CONFIG[unit]
    }));

    return (
      <div>
        {charts.map((chart, i) => <LineChart
          key={`chart=${i}`}
          syncId='summaryChart'
          data={data}
          precision={precision}
          lines={chart.metrics.map(({ name, label, stroke }) => ({
            key: name,
            dataKey: name,
            name: label,
            stroke: loading ? '#f8f8f8' : stroke
          }))}
          {...formatters}
          yTickFormatter={chart.yAxisFormatter}
          yScale={yScale}
          yLabel={chart.label}
          tooltipValueFormatter={chart.yAxisFormatter}
          referenceLines={referenceLines}
          showXAxis={i === charts.length - 1}
        />)}
      </div>
    );
  }

}
