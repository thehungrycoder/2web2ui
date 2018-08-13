import React from 'react';
import { BillingAddressForm } from '../BillingAddressForm';
import { shallow } from 'enzyme';

describe('Billing Address Form:', () => {
  let wrapper;

  const props = {
    formName: 'form-name',
    countryValue: 'GG',
    countries: [
      { value: 'US', label: 'USOFA', states: [{ name: 'mrylnd', value: 'MD' }]},
      { value: 'CA', label: 'CANADA', states: [{ name: 'alberta', value: 'AB' }]}
    ],
    change: jest.fn(),
    firstState: 'FirstState'
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

  describe('on component did update', () => {
    it('should select first state if US is selected', () => {
      wrapper.setProps({ countryValue: 'US' });
      expect(props.change).toHaveBeenCalledWith(props.formName, 'billingAddress.state', props.firstState);
    });

    it('should select first state if CA is selected', () => {
      wrapper.setProps({ countryValue: 'CA' });
      expect(props.change).toHaveBeenCalledWith(props.formName, 'billingAddress.state', props.firstState);
    });

    it('should deselect state if not US or Canada', () => {
      wrapper.setProps({ countryValue: 'AF' });
      expect(props.change).toHaveBeenCalledWith(props.formName, 'billingAddress.state', null);
    });

    it('should not do anything if country has not changed', () => {
      wrapper.setProps({ firstState: 'MD' });
      expect(props.change).not.toHaveBeenCalled();
    });
  });
});
