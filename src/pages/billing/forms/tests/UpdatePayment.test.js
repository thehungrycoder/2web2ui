import React from 'react';
import { UpdatePayment } from '../UpdatePayment';
import { shallow } from 'enzyme';

describe('Form Container: Update Contact', () => {
  let wrapper;

  const props = {
    billing: { countries: []},
    handleSubmit: jest.fn(),
    showAlert: jest.fn(),
    getBillingCountries: jest.fn(),
    billingUpdate: jest.fn(() => Promise.resolve()),
    onCancel: jest.fn()
  };

  beforeEach(() => {
    wrapper = shallow(<UpdatePayment {...props} />);
  });

  it('should render', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should get countries on mount', () => {
    const countriesSpy = jest.spyOn(wrapper.instance().props, 'getBillingCountries');
    wrapper.instance().componentDidMount();
    expect(countriesSpy).toHaveBeenCalled();
  });

  it('should submit redux-form', () => {
    const submitSpy = jest.spyOn(wrapper.instance().props, 'handleSubmit');
    wrapper.find('form').simulate('submit');
    expect(submitSpy).toHaveBeenCalled();
  });

  it('should update payment', () => {
    const updateSpy = jest.spyOn(wrapper.instance().props, 'billingUpdate');
    wrapper.instance().onSubmit('hello');
    expect(updateSpy).toHaveBeenCalledWith('hello');
  });
});
