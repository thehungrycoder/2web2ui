import React from 'react';
import { BillingContactForm } from '../BillingContactForm';
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
    wrapper = shallow(<BillingContactForm {...props} />);
  });

  it('should render', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should show states', () => {
    wrapper.setProps({ countryValue: 'US' });
    expect(wrapper).toMatchSnapshot();
  });

  describe('on component did update', () => {
    it('should select first state if US is selected', () => {
      wrapper.setProps({ countryValue: 'US' });
      expect(props.change).toHaveBeenCalledWith(props.formName, 'billingContact.state', props.firstState);
    });

    it('should select first state if CA is selected', () => {
      wrapper.setProps({ countryValue: 'CA' });
      expect(props.change).toHaveBeenCalledWith(props.formName, 'billingContact.state', props.firstState);
    });

    it('should deselect state if not US or Canada', () => {
      wrapper.setProps({ countryValue: 'AF' });
      expect(props.change).toHaveBeenCalledWith(props.formName, 'billingContact.state', null);
    });

    it('should not do anything if country has not changed', () => {
      wrapper.setProps({ firstState: 'MD' });
      expect(props.change).not.toHaveBeenCalled();
    });
  });
});
