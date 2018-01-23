import React from 'react';
import PieChart from '../PieChart';
import { shallow } from 'enzyme';

describe('Pie Chart: ', () => {
  it('renders its children', () => {
    expect(shallow(<PieChart.Legend />)).toMatchSnapshot();
    expect(shallow(<PieChart.Chart />)).toMatchSnapshot();
    expect(shallow(<PieChart.ActiveLabel />)).toMatchSnapshot();
  });
});
