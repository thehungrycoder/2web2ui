import React from 'react';
import { PaymentForm } from '../PaymentForm';
import { shallow } from 'enzyme';
import * as PaymentMock from 'payment';
import * as HelpersMock from 'src/helpers/billing';

jest.mock('payment');
jest.mock('src/helpers/billing');

describe('Payment Form: ', () => {
  let wrapper;
  let changeSpy;

  const props = {
    formName: 'form-name',
    change: jest.fn()
  };

  beforeEach(() => {
    wrapper = shallow(<PaymentForm {...props} />);
    changeSpy = jest.spyOn(wrapper.instance().props, 'change');
  });

  afterEach(() => {
    changeSpy.mockReset();
  });

  it('should register events on mount', () => {
    expect(PaymentMock.getCardArray).toHaveBeenCalledTimes(1);
    expect(HelpersMock.formatCardTypes).toHaveBeenCalledTimes(1);
    expect(PaymentMock.formatCardNumber).toHaveBeenCalledTimes(1);
    expect(PaymentMock.formatCardExpiry).toHaveBeenCalledTimes(1);
    expect(PaymentMock.formatCardCVC).toHaveBeenCalledTimes(1);
  });

  it('should render', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should handle type', () => {
    const e = { target: { value: '123' }};
    expect(changeSpy).not.toHaveBeenCalled();
    wrapper.instance().handleType(e);
    expect(PaymentMock.fns.cardType).toHaveBeenCalledWith(e.target.value);
    expect(changeSpy).toHaveBeenCalled();
  });

  it('should handle expiry', () => {
    const e = { target: { value: '11 / 2020' }};
    PaymentMock.fns.cardExpiryVal.mockImplementation(() => ({ month: '11', year: '2020' }));
    wrapper.instance().handleExpiry(e);
    expect(PaymentMock.fns.cardExpiryVal).toHaveBeenCalledWith(e.target.value);
    expect(changeSpy).toHaveBeenCalledTimes(2);
  });

  it('should not call change if length is less than 8', () => {
    const e = { target: { value: '11' }};
    wrapper.instance().handleExpiry(e);
    expect(PaymentMock.fns.cardExpiryVal).not.toHaveBeenCalled();
    expect(changeSpy).not.toHaveBeenCalled();
  });
});
