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
    ],
    change: jest.fn()
  };

  beforeEach(() => {
    wrapper = shallow(<BillingAddressForm {...props} />);
  });

  it('should render', () => {
    const stateSpy = jest.spyOn(wrapper.instance(), 'setState');
    expect(wrapper).toMatchSnapshot();
    wrapper.instance().componentDidMount();
    expect(stateSpy).not.toHaveBeenCalled();
    expect(wrapper).toHaveState('showName', true);
  });

  it('should not render name fields if provided', () => {
    const stateSpy = jest.spyOn(wrapper.instance(), 'setState');
    wrapper.setProps({ firstName: 'ann', lastName: 'perkins' });
    wrapper.instance().componentDidMount();
    expect(stateSpy).toHaveBeenCalledWith({ 'showName': false });
    expect(wrapper).toHaveState('showName', false);
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
    expect(changeSpy).toHaveBeenCalledWith(props.formName, 'billingAddress.state', null);
  });
});
