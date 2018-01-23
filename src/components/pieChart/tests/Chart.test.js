import React from 'react';
import Chart from '../async/Chart';
import { shallow } from 'enzyme';

describe('Chart: ', () => {

  const props = {
    primaryData: [{ name: 'primary' }],
    secondaryData: [{ name: 'secondary' }],
    onClick: jest.fn(),
    onMouseOver: jest.fn(),
    onMouseOut: jest.fn()
  };

  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<Chart {...props} />);
  });

  it('should render', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render hovered object', () => {
    wrapper.setProps({ hoveredItem: { dataSet: 'primary', index: 1 }});

    const pie = wrapper.find('Pie').at(0);
    expect(pie).toHaveProp('activeIndex', 1);
  });

  it('should handle mouse over primary', () => {
    wrapper.find('Pie').at(0).simulate('mouseover');
    expect(props.onMouseOver).toHaveBeenCalledWith(undefined, 'primary'); // recharts event passed as first argument
  });

  it('should handle mouse over secondary', () => {
    wrapper.find('Pie').at(1).simulate('mouseover');
    expect(props.onMouseOver).toHaveBeenCalledWith(undefined, 'secondary'); // recharts event passed as first argument
  });
});
