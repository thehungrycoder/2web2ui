import React from 'react';
import { Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, XAxis, YAxis } from 'recharts';

import styles from './EngagementChart.module.scss';

export default function EngagementChart({ data = []}) {
  // Increased top margin to vertically center the chart
  const margins = { bottom: 5, left: 5, right: 5, top: 25 };
  // Pad between tallest bar and top of the chart to provide room for the LabelList
  const topPadding = { top: 60 };

  return (
    <ResponsiveContainer className={styles.EngagementChart} height={350} width="100%">
      <BarChart barCategoryGap="35%" data={data} margin={margins}>
        <CartesianGrid strokeDasharray="4 1" vertical={false} />
        <XAxis dataKey="name" tickLine={false} />
        <YAxis padding={topPadding} tickLine={false} />
        <Bar dataKey="value" fill="#37aadc" isAnimationAction={false}>
          <LabelList fill="#55555a" position="top" />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
