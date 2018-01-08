import React from 'react';
import Legend from '../Legend';
import { shallow } from 'enzyme';

describe('Legend: ', () => {

  const props = {
    headerData: [{ name: 'header' }],
    primaryData: [{ name: 'primary' }],
    secondaryData: [{ name: 'secondary' }],
    onMouseOver: jest.fn(),
    onMouseOut: jest.fn(),
    onClick: jest.fn()
  };

  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<Legend {...props} />);
  });

  it('should render', () => {
    wrapper.setProps({ secondaryData: null });
    expect(wrapper).toMatchSnapshot();
  });

  it('should render with secondaryData', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should handle click', () => {
    wrapper.find('LegendItem').at(1).simulate('click');
    wrapper.find('LegendItem').at(2).simulate('click');
    expect(props.onClick).toHaveBeenCalledWith({ name: 'primary' });
    expect(props.onClick).toHaveBeenCalledWith({ name: 'secondary' });
  });

  it('should handle mouse over', () => {
    wrapper.find('LegendItem').at(1).simulate('mouseover');
    wrapper.find('LegendItem').at(2).simulate('mouseover');
    expect(props.onMouseOver).toHaveBeenCalledWith({ name: 'primary' }, 'primary');
    expect(props.onMouseOver).toHaveBeenCalledWith({ name: 'secondary' }, 'secondary');
  });

  it('should handle mouse out', () => {
    wrapper.find('LegendItem').at(1).simulate('mouseout');
    wrapper.find('LegendItem').at(2).simulate('mouseout');
    expect(props.onMouseOut).toHaveBeenCalledTimes(2);
  });

  it('should handle external hover', () => {
    wrapper.setProps({ hoveredItem: { dataSet: 'primary', index: 0 }});
    expect(wrapper.find('Grid')).toMatchSnapshot();
  });
});
