/* eslint-disable */
import React, { Component } from 'react';
import { PieChart, Pie, ResponsiveContainer } from 'recharts';

class ChartGroup extends Component {
  render() {
    const { categories } = this.props;

    return (
      <div>
        <ResponsiveContainer width='99%' height={500}>
          <PieChart height={500}>
            <Pie
              label
              startAngle={90}
              endAngle={450}
              data={categories}
              dataKey='count'
              innerRadius={40}
              outerRadius={80}
              fill="#8884d8" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }
}

export default ChartGroup;
