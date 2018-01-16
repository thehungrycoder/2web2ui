import React from 'react';
import { shallow } from 'enzyme';
import LabelledValue from '../LabelledValue';

describe('LabelledValue Component', () => {

  it('should render - no props', () => {
    const wrapper = shallow(<LabelledValue />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render with label and value', () => {
    const wrapper = shallow(<LabelledValue label='Label' value='a value'/>);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render children', () => {
    const wrapper = shallow(<LabelledValue label='Label'><h5>child</h5></LabelledValue>);
    expect(wrapper).toMatchSnapshot();
  });

  it('handles types correctly', () => {
    const dateString = '2018-01-16T04:14:18.661Z';
    const wrapper = shallow(<LabelledValue label='created' type='datetime' value={dateString} />);
    expect(wrapper).toMatchSnapshot();
  });
});
