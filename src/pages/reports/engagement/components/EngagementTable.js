import _ from 'lodash';
import React from 'react';

import { Empty, PanelLoading, TableCollection } from 'src/components';
import { formatNumber, formatPercent } from 'src/helpers/units';

const COLUMNS = [
  { label: 'Links', sortKey: 'link_name', width: '45%' },
  { label: 'Unique Clicks', sortKey: 'count_raw_clicked_approx', width: '145px' },
  { label: 'Clicks', sortKey: 'count_clicked', width: '130px' },
  { label: 'Percent of Total', sortKey: 'percentage_clicked', width: '160px' }
];

const DataRow = (row) => [
  row.link_name,
  formatNumber(row.count_raw_clicked_approx),
  formatNumber(row.count_clicked),
  formatPercent(row.percentage_clicked)
];

export default function EngagementTable({ data = [], loading = true }) {
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
    percentage_clicked: row.count_clicked / totalClicks * 100
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
