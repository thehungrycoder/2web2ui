import React from 'react';
import { shallow } from 'enzyme';
import BarChartDataCell from '../BarChartDataCell';

describe('BarChartDataCell', () => {
  const subject = (props = {}) => shallow(
    <BarChartDataCell
      data={{
        date: '2018-01-13',
        happy: 12,
        sad: null,
        ranking: 'good'
      }}
      dataKey="happy"
      label="Example Label"
      max={500}
      {...props}
    />
  );

  it('renders horizontal bar', () => {
    expect(subject()).toMatchSnapshot();
  });

  it('renders empty data cell', () => {
    expect(subject({ dataKey: 'sad' })).toMatchSnapshot();
  });

  it('renders percentage in tooltip', () => {
    const wrapper = subject({ relative: true });
    const Tooltip = wrapper.prop('tooltipContent');

    expect(shallow(<Tooltip />)).toMatchSnapshot();
  });

  it('calls onClick when clicked', () => {
    const onClick = jest.fn();
    const wrapper = subject({ onClick });
    wrapper.simulate('click');

    expect(onClick).toHaveBeenCalled();
  });
});
