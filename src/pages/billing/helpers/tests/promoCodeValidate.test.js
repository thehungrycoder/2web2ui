import promoCodeValidate from '../promoCodeValidate';
import { verifyPromoCode } from 'src/actions/billing';
import { change } from 'redux-form';

jest.mock('src/actions/billing');
jest.mock('redux-form');

let dispatchMock;
let promoValidate;

describe('Promo Code async validator', () => {

  beforeEach(() => {
    dispatchMock = jest.fn((a) => Promise.resolve(a));
    promoValidate = promoCodeValidate('formName');
  });

  it('does not verify if promo code is empty', async () => {
    await promoValidate({ promoCode: '' }, dispatchMock, {}, 'promoCode');
    expect(verifyPromoCode).not.toHaveBeenCalled();
    expect(change).not.toHaveBeenCalled();
  });

  it('does not verify if trigger is plan picker', async () => {
    await promoValidate({ promoCode: 'test-promo-code', planpicker: { billingId: 'test-billing-id' }}, dispatchMock, {}, 'planpicker');
    expect(verifyPromoCode).not.toHaveBeenCalled();
    expect(change).toHaveBeenCalledTimes(1);
  });

  it('validates if a promo code is attached', async () => {
    await promoValidate({ promoCode: 'test-promo-code', planpicker: { billingId: 'test-billing-id' }}, dispatchMock, {}, 'promoCode');
    expect(verifyPromoCode).toHaveBeenCalledTimes(1);
    expect(change).not.toHaveBeenCalled();
  });

  it('throws error if validation fails', () => {
    verifyPromoCode.mockRejectedValue(new Error('Validation Error'));
    return expect(promoValidate({ promoCode: 'test-promo-code', planpicker: { billingId: 'test-billing-id' }}, dispatchMock, {}, 'promoCode')).rejects.toBeDefined();
  });

  it('throws the error for the correct form', () => {
    verifyPromoCode.mockRejectedValue(new Error('Validation Error'));
    return expect(promoValidate({ promoCode: 'test-promo-code', planpicker: { billingId: 'test-billing-id' }}, dispatchMock, {}, 'promoCode')).rejects.toHaveProperty('promoCode');
  });

});
