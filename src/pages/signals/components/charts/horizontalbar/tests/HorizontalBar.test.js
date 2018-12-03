import { shallow } from 'enzyme';
import React from 'react';
import HorizontalBar from '../HorizontalBar';

describe('HorizontalBar Component', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      data: { value: 50, fill: 'blue' },
      dataKey: 'value',
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

  it('should handle click', () => {
    wrapper.find('Bar').simulate('click');
    expect(props.onClick).toHaveBeenCalled();
  });

  it('should render custom bar shape', () => {
    const shape = wrapper.find('Bar').props().shape({ extra: 'prop' });
    expect(shape).toMatchSnapshot();
  });
});
