import React from 'react';
import { shallow } from 'enzyme';
import EnableAutomaticBillingPage from '../EnableAutomaticBillingPage';

describe('EnableAutomaticBillingPage', () => {
  it('renders page with form', () => {
    const wrapper = shallow(<EnableAutomaticBillingPage />);
    expect(wrapper).toMatchSnapshot();
  });
});
