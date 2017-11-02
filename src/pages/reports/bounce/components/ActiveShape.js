import React from 'react';
import classnames from 'classnames';
import { Sector } from 'recharts';
import './BounceChart.scss';

/**
 * Custom pie chart sector that appears on hover
 */
const ActiveShape = ({
  cx, cy, fill,
  innerRadius,
  outerRadius,
  startAngle, endAngle,
  subcategories
}) => (
  <Sector
    cx={cx}
    cy={cy}
    cornerRadius={1}
    startAngle={startAngle}
    endAngle={endAngle}
    innerRadius={innerRadius}
    outerRadius={outerRadius + 3}
    fill={fill}
    opacity={1}
    className={classnames('BounceChart--forceOpacity', subcategories && 'BounceChart--hasChildren')}
  />
);

export default ActiveShape;
