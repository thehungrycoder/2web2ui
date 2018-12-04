import { shallow } from 'enzyme';
import React from 'react';
import HorizontalBar from '../HorizontalBar';

describe('HorizontalBar Component', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      barData: { value: 2, fill: 'blue', date: '2011-01-01' },
      xKey: 'value',
      xRange: [0,5],
      height: 50,
      width: 100,
      onClick: jest.fn(),
      tooltipContent: jest.fn()
    };
    wrapper = shallow(<HorizontalBar {...props}/>);
  });

  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('renders without tooltip', () => {
    wrapper.setProps({ tooltipContent: null });
    expect(wrapper).toMatchSnapshot();
  });

  it('should handle click', () => {
    wrapper.find('Bar').simulate('click');
    expect(props.onClick).toHaveBeenCalled();
  });

  it('should render tooltip', () => {
    const payload = [{ payload: props.barData }];
    const tooltip = wrapper.find('Tooltip').props().content({ payload });
    expect(tooltip).toMatchSnapshot();
    expect(props.tooltipContent).toHaveBeenCalledWith(payload[0]);
  });
});
