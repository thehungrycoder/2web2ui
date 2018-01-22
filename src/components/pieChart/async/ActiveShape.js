import React from 'react';
import classnames from 'classnames';
import { Sector } from 'recharts';
import './Chart.scss';

/**
 * Custom pie chart sector that appears on hover
 */
const ActiveShape = ({
  cx, cy, fill,
  innerRadius,
  outerRadius,
  startAngle, endAngle,
  children
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
    className={classnames('Chart--forceOpacity', children && 'Chart--hasChildren')}
  />
);

ActiveShape.displayName = 'PieChart.ActiveShape';
export default ActiveShape;
