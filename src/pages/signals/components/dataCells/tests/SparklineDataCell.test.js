import React from 'react';
import { shallow } from 'enzyme';
import SparklineDataCell from '../SparklineDataCell';

describe('SparklineDataCell', () => {
  const subject = (props = {}) => shallow(
    <SparklineDataCell
      data={[
        { date: '2018-01-12', example: 34 },
        { date: '2018-01-13', example: 50 }
      ]}
      dataKey="example"
      max={500}
      {...props}
    />
  );

  it('renders sparkline', () => {
    expect(subject()).toMatchSnapshot();
  });

  it('renders empty data cell', () => {
    const props = {
      data: [
        { date: '2018-01-12', example: null },
        { date: '2018-01-13', example: null }
      ]
    };

    expect(subject(props)).toMatchSnapshot();
  });

  it('does not render a dot when not current date', () => {
    const Dot = subject().prop('dot');
    const dotWrapper = shallow(<Dot payload={{ date: '2018-01-12' }} />);

    expect(dotWrapper.html()).toBeNull();
  });

  it('renders a dot for current date', () => {
    const Dot = subject().prop('dot');
    const dotWrapper = shallow(<Dot payload={{ date: '2018-01-13' }} />);

    expect(dotWrapper).toMatchSnapshot();
  });

  it('does not render tooltip for null value', () => {
    const Tooltip = subject().prop('tooltipContent');
    const tooltipWrapper = shallow(<Tooltip value={null} />);

    expect(tooltipWrapper.html()).toBeNull();
  });

  it('renders tooltip with absolute value', () => {
    const Tooltip = subject().prop('tooltipContent');
    const tooltipWrapper = shallow(<Tooltip payload={{ ranking: 'good' }} value={1234} />);

    expect(tooltipWrapper).toMatchSnapshot();
  });

  it('renders tooltip with relative value', () => {
    const Tooltip = subject({ relative: true }).prop('tooltipContent');
    const tooltipWrapper = shallow(<Tooltip payload={{ ranking: 'good' }} value={12} />);

    expect(tooltipWrapper).toMatchSnapshot();
  });
});
