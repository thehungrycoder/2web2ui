/* eslint-disable */
import React, { Component } from 'react';
import { TableCollection } from 'src/components';
import { Panel } from '@sparkpost/matchbox';
import _ from 'lodash';

const groups = {
  domain: {
    label: 'Recipient Domain'
  },
  campaign: {
    label: 'Campaign Name'
  },
  template: {
    label: 'Template ID'
  },
  subaccount: {
    label: 'Subaccount ID'
  },
  'sending-domain': {
    label: 'From Domain'
  },
  'sending-ip': {
    label: 'Sending IP'
  },
  'ip-pool': {
    label: 'Pool Name'
  }
};

const formatSize = (value) => {
  // Default case is Bytes
  let formatted = value;
  let suffix = 'B';

  const sizeFormatters = {
    'PB': 1.126e+15,
    'TB': 1.1e+12,
    'GB': 1.074e+9,
    'MB': 1.049e+6,
    'KB': 1024
  };

  _.forEach(sizeFormatters, (size, key) => {
    if (value > size) {
      suffix = key;
      formatted = value / size;
      return false;
    }
  });

  return `${formatted.toFixed(2)} ${suffix}`;
};

const formatPercent = (value) => {
  let formatted = `${value.toFixed(2)}%`;

  if (value < 0.01 && value > 0){
    formatted = '< 0.01%';
  }

  return formatted;
}

const formatUnit = (value, unit) => {
  let formatted = value.toLocaleString();

  if (unit === 'bytes') {
    formatted = formatSize(value)
  }

  if (unit === 'milliseconds') {
    formatted = value;
  }

  if (unit === 'percent') {
    formatted = formatPercent(value);
  }

  return formatted;
}

class Table extends Component {

  getColumnHeaders() {
    const { metrics, groupBy } = this.props;
    return [
      groups[groupBy].label,
      ...metrics.map(({ label }) => ({ label }))
    ];
  }

  getRowData() {
    const { metrics, groupBy } = this.props;
    console.log(metrics)
    return (row) => {
      return [
        row[groupBy],
        ...metrics.map((metric) => {
          return formatUnit(row[metric.key], metric.unit);
        })
      ]
    }
  }

  render() {
    if (!this.props.tableData.length || !this.props.metrics.length) {
      return null;
    }

    return (
      <div>
        <Panel></Panel>
        <TableCollection
            columns={this.getColumnHeaders()}
            getRowData={this.getRowData()}
            pagination
            defaultPerPage={10}
            rows={this.props.tableData}
            filterBox={{ show: false }}
          />
      </div>
    );
  }
}

export default Table;
