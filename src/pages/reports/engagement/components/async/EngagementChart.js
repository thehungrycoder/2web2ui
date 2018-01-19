import React from 'react';
import { Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { Panel } from '@sparkpost/matchbox';

import { Empty, PanelLoading } from 'src/components';
import { formatNumber } from 'src/helpers/units';
import styles from './EngagementChart.module.scss';

// Width must be less than 100% to get ResponsiveContainer to be responsive
const DIMENSIONS = { height: 350, width: '99%' };

// Increased top margin to vertically center the chart
const MARGINS = { bottom: 5, left: 5, right: 5, top: 25 };

// Pad between tallest bar and top of the chart to provide room for the LabelList
const TOP_PADDING = { top: 60 };

export default function EngagementChart({ accepted = 0, clicks = 0, loading = true, opens = 0, targeted = 0 }) {
  const data = [
    { label: 'Targeted', value: targeted },
    { label: 'Accepted', value: accepted },
    { label: 'Unique Confirmed Opens', value: opens },
    { label: 'Unique Clicks', value: clicks }
  ];

  if (loading) {
    return <PanelLoading />;
  }

  // targeted should always be the largest number, so if it is zero all others should be zero
  if (targeted === 0) {
    return <Empty message="No engagement to report" />;
  }

  return (
    <Panel sectioned>
      <div className={styles.EngagementChart}>
        <ResponsiveContainer {...DIMENSIONS}>
          <BarChart barCategoryGap="35%" data={data} margin={MARGINS}>
            <CartesianGrid strokeDasharray="4 1" vertical={false} />
            <XAxis dataKey="label" tickLine={false} />
            <YAxis padding={TOP_PADDING} tickLine={false} tickFormatter={formatNumber} />
            <Bar dataKey="value" fill="#37aadc" isAnimationActive={false}>
              <LabelList fill="#55555a" formatter={formatNumber} position="top" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Panel>
  );
}
