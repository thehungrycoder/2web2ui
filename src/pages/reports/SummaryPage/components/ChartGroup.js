import React, { Component } from 'react';
import _ from 'lodash';
import { getDayLines, getLineChartFormatters, getUnitTickFormatter } from 'helpers/chart';
import LineChart from './LineChart';

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
    const { data = [], metrics, loading, precision } = this.props;

    if (!data.length || !metrics) {
      return null;
    }

    const formatters = getLineChartFormatters(precision);
    const referenceLines = this.createDayReferenceLines();
    const measures = _.uniq(metrics.map((m) => m.measure));

    return (
      <div>
        {measures.map((currentMeasure, i) => <LineChart
          key={`chart=${i}`}
          syncId='summaryChart'
          data={data}
          lines={metrics.filter(({ measure }) => measure === currentMeasure).map(({ name, label, stroke }) => ({
            key: name,
            dataKey: name,
            name: label,
            stroke: loading ? '#f8f8f8' : stroke
          }))}
          {...formatters}
          yTickFormatter={getUnitTickFormatter(_.find(metrics, { measure: currentMeasure }).unit)}
          referenceLines={referenceLines}
          showXAxis={i === measures.length - 1}
        />)}
      </div>
    );
  }

}
