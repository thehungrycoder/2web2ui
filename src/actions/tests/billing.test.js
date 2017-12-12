import { createMockStore } from 'src/__testHelpers__/mockStore';
import * as billing from '../billing';
import * as billingHelpers from 'src/helpers/billing';
import _ from 'lodash';

jest.mock('../helpers/sparkpostApiRequest', () => jest.fn((a) => a));
jest.mock('../helpers/zuoraRequest', () => jest.fn((a) => a));
jest.mock('src/helpers/billing');

describe('Action Creator: Billing', () => {

  let mockStore;
  let token;
  let signature;

  function snapActions() {
    expect(mockStore.getActions()).toMatchSnapshot();
  }

  beforeEach(() => {
    mockStore = createMockStore({});
    token = 'SOME$%TEST#*TOKEN';
    signature = 'some-test-signature';
  });

  it('should dispatch a subscription sync action', () => {
    mockStore.dispatch(billing.syncSubscription());
    snapActions();
  });

  it('should dispatch an update subscription action', async() => {
    const dispatchMock = jest.fn((a) => Promise.resolve(a));
    const thunk = billing.updateSubscription('test-code');
    await thunk(dispatchMock);
    expect(_.flatten(dispatchMock.mock.calls)).toMatchSnapshot();
  });

  it('should dispatch a cors action', () => {
    mockStore.dispatch(billing.cors('some-context', { some: 'cors-data' }));
    snapActions();
  });

  it('should dispatch an update credit card action', () => {
    const data = { some: 'credit-card-data' };

    mockStore.dispatch(billing.updateCreditCard({ data, token, signature }));
    snapActions();
  });

  it('should dispatch a create zuora account action', () => {
    const data = { some: 'test-zuora-data' };
    mockStore.dispatch(billing.createZuoraAccount({ data, token, signature }));
    snapActions();
  });

  it('should dispatch a chained billing create action', async() => {
    const dispatchMock = jest.fn((a) => Promise.resolve(a));
    const corsData = { some: 'test-cors-data' };
    const billingData = { some: 'test-billing-data' };
    billing.cors = jest.fn(() => ({ token, signature }));
    billingHelpers.formatDataForCors = jest.fn((values) => ({ values, corsData, billingData }));
    billingHelpers.formatCreateData = jest.fn(() => ({ formatted: 'data' }));

    const thunk = billing.billingCreate({ some: 'test-values' });
    await thunk(dispatchMock);

    expect(_.flatten(dispatchMock.mock.calls)).toMatchSnapshot();
  });

  it('should dispatch a chained billing update action', async() => {
    const dispatchMock = jest.fn((a) => Promise.resolve(a));
    const accountKey = { some: 'test-billing-data' };
    billingHelpers.formatUpdateData = jest.fn((values) => ({ accountKey }));

    const thunk = billing.billingUpdate({ planpicker: { code: 'test-plan' }});
    await thunk(dispatchMock);

    expect(_.flatten(dispatchMock.mock.calls)).toMatchSnapshot();
  });

});
