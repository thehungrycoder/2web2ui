import React from 'react';
import MetricCard from '../MetricCard';
import { shallow } from 'enzyme';

const props = {
  label: 'Card Label',
  value: 'Card Value',
  tooltipContent: 'Tooltip Content',
  primary: true
};

describe('MetricCard Component: ', () => {
  it('should render correctly with all props', () => {
    const wrapper = shallow(<MetricCard {...props}/>);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render without tooltip', () => {
    const wrapper = shallow(<MetricCard {...props}/>);
    wrapper.setProps({ tooltipContent: null });
    expect(wrapper).toMatchSnapshot();
  });
});
