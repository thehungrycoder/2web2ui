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

  it('should render with label and value when value is boolean', () => {
    const wrapper = shallow(<LabelledValue label='Label' value={false} />);
    expect(wrapper).toMatchSnapshot();
  });
});
