import React from 'react';
import { shallow } from 'enzyme';

import RestrictToIpPoolCheckbox from '../RestrictToIpPoolCheckbox';

describe('RestrictToIpPoolCheckbox', () => {
  it('renders enabled checkbox', () => {
    const wrapper = shallow(<RestrictToIpPoolCheckbox />);
    expect(wrapper).toMatchSnapshot();
  });

  it('renders disabled checkbox', () => {
    const wrapper = shallow(<RestrictToIpPoolCheckbox disabled={true} />);
    expect(wrapper).toMatchSnapshot();
  });
});
