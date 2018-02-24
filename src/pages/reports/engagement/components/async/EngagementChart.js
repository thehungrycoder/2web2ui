import React from 'react';
import { Bar, BarChart, CartesianGrid, LabelList, ReferenceArea, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { Panel } from '@sparkpost/matchbox';

import { Empty, PanelLoading } from 'src/components';
import { formatNumber, formatPercent } from 'src/helpers/units';
import { getRate } from 'src/helpers/metrics';
import styles from './EngagementChart.module.scss';

// Width must be less than 100% to get ResponsiveContainer to be responsive
const DIMENSIONS = { height: 350, width: '99%' };

// Increased top margin to vertically center the chart
const MARGINS = { bottom: 5, left: 5, right: 5, top: 25 };

// Pad between tallest bar and top of the chart to provide room for the LabelList
const TOP_PADDING = { top: 60 };


// NOTE: ReferenceArea was used because they could easily attach to two bars and provide the
// cooridinates and dimmenions to reliable place this label
function PercentLabel({ percentage, width, x, yAxis }) {
  const label = { height: 24, width: 64 };
  const offset = (width / 2) - (label.width / 2);
  const y = yAxis.y + (yAxis.height / yAxis.tickCount) * Math.round(yAxis.tickCount / 2);

  return (
    <g>
      <svg {...label} x={x + offset} y={y - label.height / 2 + 1}>
        <path
          d="M3 1h52c.7 0 1.3.3 1.6.8l6.4 9c.5.7.5 1.7-.1 2.4l-6.3 8c-.4.5-1 .8-1.6.8H3a2 2 0 0 1-2-2V3c0-1.1.9-2 2-2z"
          fill="white"
          stroke="#e1e1e6"
          strokeMiterlimit="10"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <text x={x + offset + 5} y={y + 6} fill="#55555a">{percentage}</text>
    </g>
  );
}

export default function EngagementChart({ accepted = 0, clicks = 0, loading, opens = 0, targeted = 0 }) {
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
            <ReferenceArea
              x1="Targeted" x2="Accepted"
              percentage={formatPercent(getRate(accepted, targeted))}
              shape={PercentLabel}
            />
            <ReferenceArea
              x1="Accepted" x2="Unique Confirmed Opens"
              percentage={formatPercent(getRate(opens, targeted))}
              shape={PercentLabel}
            />
            <ReferenceArea
              x1="Unique Confirmed Opens" x2="Unique Clicks"
              percentage={formatPercent(getRate(clicks, targeted))}
              shape={PercentLabel}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Panel>
  );
}
