import billingUpdate from '../billingUpdate';
import * as accountActions from 'src/actions/account';
import * as billingActions from 'src/actions/billing';
import * as billingHelpers from 'src/helpers/billing';

jest.mock('src/actions/account');
jest.mock('src/actions/billing');
jest.mock('src/helpers/billing');

describe('Action Creator: Billing Update', () => {
  let dispatch;

  beforeEach(() => {
    dispatch = jest.fn((a) => a);
    billingActions.cors = jest.fn(({ meta }) => meta.onSuccess({
      results: {
        accountKey: 'account-key',
        signature: 'TEST_SIGNATURE',
        token: 'TEST_TOKEN'
      }
    }));
    billingActions.updateCreditCard = jest.fn(({ meta }) => meta.onSuccess({}));
    billingActions.updateSubscription = jest.fn(({ meta }) => meta.onSuccess({}));
    billingActions.syncSubscription = jest.fn(({ meta }) => meta.onSuccess({}));
    billingActions.collectPayments = jest.fn(({ meta }) => meta.onSuccess({}));
    accountActions.fetch = jest.fn();
    billingHelpers.formatUpdateData = jest.fn((a) => a);
  });

  it('update without a planpicker code', () => {
    const values = {};
    const thunk = billingUpdate(values);

    thunk(dispatch);

    expect(billingActions.cors).toHaveBeenCalledWith(expect.objectContaining({
      context: 'update-billing'
    }));
    expect(billingActions.updateCreditCard).toHaveBeenCalledWith(expect.objectContaining({
      data: {
        accountKey: 'account-key'
      },
      signature: 'TEST_SIGNATURE',
      token: 'TEST_TOKEN'
    }));
    expect(billingActions.updateSubscription).not.toHaveBeenCalled();
    expect(billingActions.syncSubscription).toHaveBeenCalled();
    expect(billingActions.collectPayments).toHaveBeenCalled();
    expect(accountActions.fetch).toHaveBeenCalledWith({ include: 'usage,billing' });
  });

  it('update with a planpicker code', () => {
    const values = {
      planpicker: {
        code: 'plan-code'
      }
    };
    const thunk = billingUpdate(values);

    thunk(dispatch);

    expect(billingActions.cors).toHaveBeenCalledWith(expect.objectContaining({
      context: 'update-billing'
    }));
    expect(billingActions.updateCreditCard).toHaveBeenCalledWith(expect.objectContaining({
      data: {
        accountKey: 'account-key',
        ...values
      },
      signature: 'TEST_SIGNATURE',
      token: 'TEST_TOKEN'
    }));
    expect(billingActions.updateSubscription).toHaveBeenCalledWith(expect.objectContaining({
      code: 'plan-code'
    }));
    expect(billingActions.syncSubscription).toHaveBeenCalled();
    expect(billingActions.collectPayments).toHaveBeenCalled();
    expect(accountActions.fetch).toHaveBeenCalledWith({ include: 'usage,billing' });
  });
});
