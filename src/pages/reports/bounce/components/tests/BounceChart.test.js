import React from 'react';
import BounceChart from '../BounceChart';
import { shallow } from 'enzyme';

describe('BounceChart: ', () => {

  const props = {
    primaryData: [{ name: 'primary'}],
    secondaryData: [{ name: 'secondary' }],
    onClick: jest.fn(),
    handleClick: jest.fn(),
    handleMouseOver: jest.fn(),
    handleMouseOut: jest.fn()
  }

  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<BounceChart {...props} />)
  })

  it('should render', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render hovered object', () => {
    wrapper.setProps({ hoveredItem: { dataSet: 'primary', index: 1 } })
    const pie = wrapper.find('Pie').at(0);
    expect(pie).toHaveProp('activeIndex', 1);
  });

  it('should handle mouse over primary', () => {
    wrapper.find('Pie').at(0).simulate('mouseover');
    expect(props.handleMouseOver).toHaveBeenCalledWith(undefined, 'primary'); // recharts event passed as first argument
  });

  it('should handle mouse over secondary', () => {
    wrapper.find('Pie').at(1).simulate('mouseover');
    expect(props.handleMouseOver).toHaveBeenCalledWith(undefined, 'secondary'); // recharts event passed as first argument
  });
});
