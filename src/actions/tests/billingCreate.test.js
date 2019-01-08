import billingCreate from '../billingCreate';
import * as accountActions from 'src/actions/account';
import * as billingActions from 'src/actions/billing';
import * as accountConditions from 'src/helpers/conditions/account';
import * as billingHelpers from 'src/helpers/billing';

jest.mock('src/actions/account');
jest.mock('src/actions/billing');
jest.mock('src/helpers/conditions/account');
jest.mock('src/helpers/billing');

describe('Action Creator: Billing Create', () => {
  let dispatch;
  let values;
  let currentUser;
  let corsData;
  let billingData;
  let getState;

  beforeEach(() => {
    values = {};
    currentUser = {
      email: 'test@example.com'
    };
    corsData = {
      email: 'test@example.com'
    };
    billingData = {
      billingId: 'test-billing-id',
      billToContact: {},
      creditCard: {
        cardNumber: '1111222233334444'
      },
      invoiceCollect: true
    };
    getState = () => ({ currentUser });
    dispatch = jest.fn((a) => a);
    accountConditions.isAws = jest.fn(() => false);
    accountConditions.isCustomBilling = jest.fn(() => false);
    billingActions.createZuoraAccount = jest.fn(({ meta }) => meta.onSuccess({}));
    billingActions.syncSubscription = jest.fn(({ meta }) => meta.onSuccess({}));
    billingActions.consumePromoCode = jest.fn(({ meta }) => meta.onSuccess({}));
    billingActions.cors = jest.fn(({ meta }) => meta.onSuccess({
      results: {
        signature: 'TEST_SIGNATURE',
        token: 'TEST_TOKEN'
      }
    }));
    accountActions.fetch = jest.fn(({ meta }) => meta.onSuccess({}));
    billingHelpers.formatCreateData = jest.fn((a) => a);
    billingHelpers.formatDataForCors = jest.fn((a) => ({ billingData, corsData }));
  });

  it('update without a planpicker code', () => {

    const thunk = billingCreate(values);
    accountActions.fetch = jest.fn();

    thunk(dispatch, getState);

    expect(billingActions.cors).toHaveBeenCalledWith(expect.objectContaining({
      context: 'create-account',
      data: corsData
    }));

    expect(billingActions.createZuoraAccount).toHaveBeenCalledWith(expect.objectContaining({
      data: billingData,
      signature: 'TEST_SIGNATURE',
      token: 'TEST_TOKEN'
    }));

    expect(billingActions.syncSubscription).toHaveBeenCalled();
    expect(accountActions.fetch).toHaveBeenCalledWith(expect.objectContaining({ include: 'usage,billing' }));

    expect(billingActions.consumePromoCode).not.toHaveBeenCalled();
  });

  it('update subscription for AWS users', () => {
    const state = jest.fn();
    const values = { planpicker: { code: 'plan-code' }};
    const thunk = billingCreate(values);

    accountConditions.isAws = jest.fn(() => true);
    billingActions.updateSubscription = jest.fn();

    thunk(dispatch, () => state);
    expect(accountConditions.isAws).toHaveBeenCalledWith(state);
    expect(billingActions.updateSubscription).toHaveBeenCalledWith({ code: 'plan-code' });
  });

  it('should consume promo code if available', () => {
    values = { promoCode: 'test-promo-code' };

    const thunk = billingCreate(values);
    billingActions.consumePromoCode = jest.fn();

    thunk(dispatch, getState);

    expect(billingActions.cors).toHaveBeenCalledWith(expect.objectContaining({
      context: 'create-account',
      data: corsData
    }));

    expect(billingActions.createZuoraAccount).toHaveBeenCalledWith(expect.objectContaining({
      data: billingData,
      signature: 'TEST_SIGNATURE',
      token: 'TEST_TOKEN'
    }));
    expect(billingActions.syncSubscription).toHaveBeenCalled();
    expect(accountActions.fetch).toHaveBeenCalledWith(expect.objectContaining({ include: 'usage,billing' }));

    expect(billingActions.consumePromoCode).toHaveBeenCalledWith(expect.objectContaining({
      promoCode: 'test-promo-code',
      billingId: 'test-billing-id'
    }));
  });
});
