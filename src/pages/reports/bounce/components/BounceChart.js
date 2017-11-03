import React from 'react';
import cx from 'classnames';
import { PieChart, Pie, ResponsiveContainer } from 'recharts';

import ActiveShape from './ActiveShape';
import './BounceChart.scss';

const BounceChart = ({
  primaryData, // Outer pie chart
  secondaryData, // Inner pie chart
  handleMouseOver,
  handleMouseOut,
  handleClick,
  hoveredItem
}) => {
  const sharedProps = {
    activeShape: ActiveShape, // Custom "active" (hover) sector component
    onMouseOut: handleMouseOut,
    onClick: handleClick,
    dataKey: 'count',
    paddingAngle: 0.5,
    minAngle: 2,
    startAngle: 90,
    endAngle: 450,
    animationDuration: 1000
  };

  const hoveredDataSet = hoveredItem && hoveredItem.dataSet;

  return (
    <div className={cx('BounceChart', hoveredItem && 'BounceChart--hover')}>
      <ResponsiveContainer width='100%' height={350}>
        <PieChart height={350}>
          <Pie
            activeIndex={hoveredDataSet === 'primary' ? hoveredItem.index : null}
            onMouseOver={(e) => handleMouseOver(e, 'primary')}
            data={primaryData}
            innerRadius={100}
            outerRadius={140}
            {...sharedProps} />
          <Pie
            activeIndex={hoveredDataSet === 'secondary' ? hoveredItem.index : null}
            onMouseOver={(e) => handleMouseOver(e, 'secondary')}
            data={secondaryData}
            innerRadius={75}
            outerRadius={95}
            {...sharedProps} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BounceChart;
