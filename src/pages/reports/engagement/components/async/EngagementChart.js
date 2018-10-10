import React from 'react';
import { Bar, BarChart, CartesianGrid, LabelList, ReferenceArea, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { Panel } from '@sparkpost/matchbox';

import { Empty, PanelLoading } from 'src/components';
import { formatNumber, formatPercent } from 'src/helpers/units';
import { safeRate } from 'src/helpers/math';
import PercentLabel from '../PercentLabel';
import styles from './EngagementChart.module.scss';

// Width must be less than 100% to get ResponsiveContainer to be responsive
const DIMENSIONS = { height: 350, width: '99%' };

// Increased top margin to vertically center the chart
const MARGINS = { bottom: 5, left: 5, right: 5, top: 25 };

// Pad between tallest bar and top of the chart to provide room for the LabelList
const TOP_PADDING = { top: 60 };

export default function EngagementChart({ accepted = 0, clicks = 0, loading, opens = 0, sent = 0 }) {
  const data = [
    { label: 'Sent', value: sent },
    { label: 'Accepted', value: accepted },
    { label: 'Unique Confirmed Opens', value: opens },
    { label: 'Unique Clicks', value: clicks }
  ];

  if (loading) {
    return <PanelLoading />;
  }

  // sent should always be the largest number, so if it is zero all others should be zero
  if (sent === 0) {
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
            <ReferenceArea
              x1="Sent" x2="Accepted"
              percentage={formatPercent(safeRate(accepted, sent))}
              shape={PercentLabel}
            />
            <ReferenceArea
              x1="Accepted" x2="Unique Confirmed Opens"
              percentage={formatPercent(safeRate(opens, accepted))}
              shape={PercentLabel}
            />
            <ReferenceArea
              x1="Unique Confirmed Opens" x2="Unique Clicks"
              percentage={formatPercent(safeRate(clicks, accepted))}
              shape={PercentLabel}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Panel>
  );
}
