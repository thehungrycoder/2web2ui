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

  it('should validate the expiration date', () => {
    expect(wrapper.instance().dateFormat('22')).toEqual('Must be MM / YYYY');
    expect(wrapper.instance().dateFormat('10 / 2020')).toEqual(undefined);
  });

  it('validates card type', () => {
    PaymentMock.fns.cardType = jest.fn().mockReturnValue('Visa');
    expect(wrapper.instance().validateType('')).toBeUndefined();

    PaymentMock.fns.cardType = jest.fn().mockReturnValue('UnknownCard');
    expect(wrapper.instance().validateType('')).toMatchSnapshot();
  });
});
