import React from 'react';
import { shallow } from 'enzyme';

import { SupportContact } from '../SupportContact';

describe('SupportContact', () => {
  it('renders contact support information', () => {
    const wrapper = shallow(<SupportContact entitledToPhoneSupport={true} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('renders null when user is not entitled to phone support', () => {
    const wrapper = shallow(<SupportContact entitledToPhoneSupport={false} />);
    expect(wrapper.type()).toBeNull();
  });
});
