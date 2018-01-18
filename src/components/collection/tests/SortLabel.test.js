import React from 'react';
import SortLabel from '../SortLabel';
import { shallow } from 'enzyme';

describe('Collection SortLabel Component', () => {
  const props = {
    direction: 'asc',
    label: 'Table Header Label',
    anotherprop: 'anotherProp'
  };

  // Can't test more than this
  // Need to find out how to get css-modules rendered in enzyme
  it('should render correctly', () => {
    const wrapper = shallow(<SortLabel {...props}/>);
    expect(wrapper).toMatchSnapshot();
  });
});
