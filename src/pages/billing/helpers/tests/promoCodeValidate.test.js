import promoCodeValidate from '../promoCodeValidate';

let dispatchMock;
let promoValidate;

describe('Promo Code async validator', () => {

  beforeEach(() => {
    dispatchMock = jest.fn((a) => Promise.resolve(a));
    promoValidate = promoCodeValidate('formName');
  });

  it('does not verify if promo code is empty', async () => {
    await promoValidate({ promoCode: '' }, dispatchMock, {}, 'promoCode');
    expect(dispatchMock.mock.calls).toMatchSnapshot();
  });

  it('does not verify if trigger is plan picker', async () => {
    await promoValidate({ promoCode: 'test-promo-code', planpicker: { billingId: 'test-billing-id' }}, dispatchMock, {}, 'planpicker');
    expect(dispatchMock.mock.calls).toMatchSnapshot();
  });

  it('validates if a promo code is attached', async () => {
    await promoValidate({ promoCode: 'test-promo-code', planpicker: { billingId: 'test-billing-id' }}, dispatchMock, {}, 'promoCode');
    expect(dispatchMock.mock.calls).toMatchSnapshot();
  });

});
