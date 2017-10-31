/* eslint-disable */
import React, { Component } from 'react';

import { generateColors } from 'src/helpers/bounce';
import { PieChart, Pie, ResponsiveContainer } from 'recharts';
import { Grid } from '@sparkpost/matchbox';

class ChartGroup extends Component {
  render() {
    const { categories } = this.props;
    const data = generateColors(categories);

    const table = categories.map((category, i) => {
      return <p key={i}>{category.name} - {category.count}</p>
    });
    return (
      <div>
        <Grid>
          <Grid.Column xs={6}>
            <ResponsiveContainer width='99%' height={450}>
              <PieChart height={450}>
                <Pie
                  onClick={(d) => console.log(d) }
                  onMouseOver={(d) => console.log(d) }
                  startAngle={90}
                  endAngle={450}
                  data={data}
                  dataKey='count'
                  innerRadius={100}
                  outerRadius={140}
                  fill="#DB2F3D" />
              </PieChart>
            </ResponsiveContainer>
          </Grid.Column>
          <Grid.Column>
            {table}
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default ChartGroup;
