import _ from 'lodash';
import React from 'react';
import { Icon, Tooltip } from '@sparkpost/matchbox';

import { Empty, PanelLoading, TableCollection } from 'src/components';
import { map as metrics } from 'src/config/metrics';
import { formatNumber, formatPercent } from 'src/helpers/units';
import { safeRate } from 'src/helpers/math';

const COLUMNS = [
  {
    key: 'link_name',
    label: 'Link',
    sortKey: 'link_name',
    width: '40%'
  },
  {
    key: 'count_raw_clicked_approx',
    label: (
      <span>
        Unique Clicks
        <Tooltip dark top content={metrics.count_raw_clicked_approx.description}>
          <Icon name="InfoOutline" style={{ marginLeft: '5px' }} />
        </Tooltip>
      </span>
    ),
    sortKey: 'count_raw_clicked_approx',
    width: '20%'
  },
  {
    key: 'count_clicked',
    label: (
      <span>
        Clicks
        <Tooltip dark top content={metrics.count_clicked.description}>
          <Icon name="InfoOutline" style={{ marginLeft: '5px' }} />
        </Tooltip>
      </span>
    ),
    sortKey: 'count_clicked',
    width: '20%'
  },
  {
    key: 'percentage_clicked',
    label: 'Percent of Total',
    sortKey: 'percentage_clicked',
    width: '20%'
  }
];

const DataRow = (row) => [
  row.link_name,
  formatNumber(row.count_raw_clicked_approx),
  formatNumber(row.count_clicked),
  formatPercent(row.percentage_clicked)
];

export default function EngagementTable({ data, loading }) {
  if (loading) {
    return <PanelLoading />;
  }

  if (data.length === 0) {
    return <Empty message="No clicks to report" />;
  }

  // Manually count the total number of clicks (FWIW didn't included metric with chart data request,
  // and use the result here to avoid the dependency)
  const totalClicks = _.sumBy(data, 'count_clicked');

  // Must include percentage in data for sorting
  const dataWithPercentage = data.map((row) => ({
    ...row,
    percentage_clicked: safeRate(row.count_clicked, totalClicks)
  }));

  return (
    <TableCollection
      columns={COLUMNS}
      defaultSortColumn="count_clicked"
      defaultSortDirection="desc"
      getRowData={DataRow}
      pagination
      rows={dataWithPercentage}
    />
  );
}
