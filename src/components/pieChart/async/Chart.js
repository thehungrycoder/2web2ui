import React from 'react';
import cx from 'classnames';
import { PieChart, Pie, ResponsiveContainer } from 'recharts';

import ActiveShape from './ActiveShape';
import './Chart.scss';

const Chart = ({
  primaryData, // Outer pie chart
  secondaryData, // Inner pie chart
  onMouseOver,
  onMouseOut,
  onClick,
  hoveredItem
}) => {
  const sharedProps = {
    activeShape: ActiveShape, // Custom "active" (hover) sector component
    onMouseOut: onMouseOut,
    onClick: onClick,
    dataKey: 'count',
    paddingAngle: 0.5,
    minAngle: 3,
    startAngle: 90,
    endAngle: 450,
    animationDuration: 1000
  };

  const hoveredDataSet = hoveredItem && hoveredItem.dataSet;

  return (
    <div className={cx('Chart', hoveredItem && 'Chart--hover')}>
      <ResponsiveContainer width='100%' height={350}>
        <PieChart height={350}>
          <Pie
            activeIndex={hoveredDataSet === 'primary' ? hoveredItem.index : null}
            onMouseOver={(e) => onMouseOver(e, 'primary')}
            data={primaryData}
            innerRadius={100}
            outerRadius={135}
            {...sharedProps} />
          <Pie
            activeIndex={hoveredDataSet === 'secondary' ? hoveredItem.index : null}
            onMouseOver={(e) => onMouseOver(e, 'secondary')}
            data={secondaryData}
            innerRadius={75}
            outerRadius={95}
            {...sharedProps} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
