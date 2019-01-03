import React from 'react';
import { shallow } from 'enzyme';
import BarChartDataCell from '../BarChartDataCell';

describe('BarChartDataCell', () => {
  const subject = (props = {}) => shallow(
    <BarChartDataCell
      data={{ date: '2018-01-13', example: 12 }}
      dataKey="example"
      label="Example Label"
      max={500}
      {...props}
    />
  );

  it('renders horizontal bar', () => {
    expect(subject()).toMatchSnapshot();
  });

  it('renders empty data cell', () => {
    expect(subject({ dataKey: 'unknown' })).toMatchSnapshot();
  });

  describe('when relative', () => {
    const wrapper = subject({ relative: true });

    it('renders percentage in tooltip', () => {
      const Tooltip = wrapper.prop('tooltipContent');
      expect(shallow(<Tooltip />)).toMatchSnapshot();
    });

    it('renders bar with static max range', () => {
      expect(wrapper.prop('xRange')[1]).toEqual(100);
    });
  });
});
