import React from 'react';
import { BillingAddressForm } from '../BillingAddressForm';
import { shallow } from 'enzyme';

describe('Billing Address Form:', () => {
  let wrapper;

  const props = {
    formName: 'form-name',
    countryValue: 'GG',
    countries: [
      { value: 'US', label: 'USOFA', states: [{ name: 'mrylnd', value: 'MD' }]}
    ]
  };

  beforeEach(() => {
    wrapper = shallow(<BillingAddressForm {...props} />);
  });

  it('should render', () => {
    expect(wrapper).toMatchSnapshot();
    expect(wrapper).toHaveState('showName', true);
  });

  it('should not render name fields if provided', () => {
    wrapper.setProps({ firstName: 'ann', lastName: 'perkins' });
    wrapper.instance().componentDidMount();
    expect(wrapper).toHaveState('showName', false);
  });

  it('should show states', () => {
    wrapper.setProps({ countryValue: 'US' });
    expect(wrapper).toMatchSnapshot();
  });

});
