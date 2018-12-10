import React from 'react';
import { shallow } from 'enzyme';
import Column from '../Column';

describe('Column', () => {
  it('renders null', () => {
    const wrapper = shallow(<Column dataKey="value" label="Value" />);
    expect(wrapper.html()).toBeNull();
  });
});
