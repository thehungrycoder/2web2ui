import React from 'react';
import { BillingContactForm } from '../BillingContactForm';
import { shallow } from 'enzyme';

describe('Billing Address Form:', () => {
  let wrapper;

  const props = {
    formName: 'form-name',
    countryValue: 'GG',
    countries: [
      { value: 'US', label: 'USOFA', states: [{ name: 'mrylnd', value: 'MD' }]}
    ],
    change: jest.fn()
  };

  beforeEach(() => {
    wrapper = shallow(<BillingContactForm {...props} />);
  });

  it('should render', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should show states', () => {
    wrapper.setProps({ countryValue: 'US' });
    expect(wrapper).toMatchSnapshot();
  });

  it('should handle state value', () => {
    const changeSpy = jest.spyOn(wrapper.instance().props, 'change');
    wrapper.instance().handleCountryChange({ target: { value: 'US' }});
    expect(changeSpy).not.toHaveBeenCalled();
    changeSpy.mockReset();
    wrapper.instance().handleCountryChange({ target: { value: 'GG' }});
    expect(changeSpy).toHaveBeenCalledWith(props.formName, 'billingContact.state', null);
  });
});
