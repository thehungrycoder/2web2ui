/* eslint-disable */
import React from 'react';
import classnames from 'classnames';
import { PieChart, Pie, ResponsiveContainer } from 'recharts';

import ActiveShape from './ActiveShape';
import './BounceChart.scss';

const BounceChart = ({
  primaryData, // Outer pie chart
  secondaryData, // Inner pie chart
  handleMouseOver,
  handleMouseOut,
  active,
  activeSet
}) => {
  const wrapperClasses = classnames('BounceChart', active && 'BounceChart--active');

  const sharedProps = {
    activeShape: ActiveShape,
    onMouseOut: handleMouseOut,
    dataKey: 'count',
    paddingAngle: 0.5,
    startAngle: 90,
    endAngle: 450,
    animationDuration: 1000
  }

  return (
    <div className={wrapperClasses}>
      <ResponsiveContainer width='99%' height={350}>
        <PieChart height={350}>
          <Pie
            onClick={(d) => console.log(d) }
            activeIndex={activeSet === 'primary' ? active.index : null}
            onMouseOver={(e) => handleMouseOver(e, 'primary')}
            data={primaryData}
            innerRadius={100}
            outerRadius={140}
            {...sharedProps} />
          <Pie
            onClick={(d) => console.log(d) }
            activeIndex={activeSet === 'secondary' ? active.index : null}
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
