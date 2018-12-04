import { shallow } from 'enzyme';
import React from 'react';
import Sparkline from '../Sparkline';

describe('Sparkline Component', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      timeSeries: [{ value: 1, date: new Date('2010-01-01T12:00:00.000Z') },{ value: 2 },{ value: 3 }],
      yRange: [0,3],
      yKey: 'value',
      height: 50,
      width: 100,
      stroke: '#huh',
      onClick: jest.fn(),
      tooltipContent: jest.fn()
    };
    wrapper = shallow(<Sparkline {...props}/>);
  });

  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('renders without tooltip', () => {
    wrapper.setProps({ tooltipContent: null });
    expect(wrapper).toMatchSnapshot();
  });

  it('should handle click', () => {
    wrapper.find('LineChart').simulate('click');
    expect(props.onClick).toHaveBeenCalled();
  });

  it('should render tooltip', () => {
    const payload = [{ payload: props.timeSeries[0] }];
    const tooltip = wrapper.find('Tooltip').props().content({ payload });
    expect(tooltip).toMatchSnapshot();
    expect(props.tooltipContent).toHaveBeenCalledWith(payload[0]);
  });
});
