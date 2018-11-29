import { shallow } from 'enzyme';
import React from 'react';
import Sparkline from '../Sparkline';

const mockNow = new Date('2010-01-01T12:00:00.000Z');
global.Date = jest.fn(() => mockNow);

describe('Sparkline Component', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      data: [{ value: 1 },{ value: 2 },{ value: 3 }],
      height: 50,
      width: 100,
      stroke: '#huh',
      onClick: jest.fn(),
      tooltipContent: jest.fn()
    };
    wrapper = shallow(<Sparkline {...props}/>);
  });

  it('renders correctly with default props', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should handle click', () => {
    wrapper.find('LineChart').simulate('click');
    expect(props.onClick).toHaveBeenCalled();
  });

  it('should render tooltip', () => {
    const tooltip = shallow(wrapper.find('Tooltip').props().content());
    expect(tooltip).toMatchSnapshot();
    expect(props.tooltipContent).toHaveBeenCalledTimes(1);
  });
});
