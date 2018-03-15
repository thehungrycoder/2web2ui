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
  let corsData;
  let billingData;
  let accountKey;
  let dispatchMock;
  let getStateMock;
  let testState;

  function snapActions() {
    expect(mockStore.getActions()).toMatchSnapshot();
  }

  beforeEach(() => {
    mockStore = createMockStore({});
    token = 'SOME$%TEST#*TOKEN';
    signature = 'some-test-signature';
    corsData = { some: 'test-cors-data' };
    billingData = { some: 'test-billing-data', billToContact: {}};
    accountKey = { some: 'test-billing-data' };
    testState = {
      currentUser: {
        email: 'sparkpost-user-email@example.com'
      }
    };

    dispatchMock = jest.fn((a) => Promise.resolve(a));
    getStateMock = jest.fn(() => testState);

    billingHelpers.formatDataForCors = jest.fn((values) => ({ values, corsData, billingData }));
    billingHelpers.formatCreateData = jest.fn(() => ({
      billToContact: {},
      creditCard: {},
      subscription: {}
    }));
    billingHelpers.formatUpdateData = jest.fn((values) => ({ accountKey }));
  });

  it('should dispatch a subscription sync action', () => {
    mockStore.dispatch(billing.syncSubscription());
    snapActions();
  });

  it('should dispatch an update subscription action', async() => {
    const dispatchMock = jest.fn((a) => Promise.resolve(a));
    await billing.updateSubscription('test-code')(dispatchMock);
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
    billing.cors = jest.fn(() => ({ token, signature }));
    await billing.billingCreate({ some: 'test-values' })(dispatchMock, getStateMock);
    expect(_.flatten(dispatchMock.mock.calls)).toMatchSnapshot();
  });

  it('should dispatch a chained billing update action', async() => {
    await billing.billingUpdate({ planpicker: { code: 'test-plan' }})(dispatchMock);
    expect(_.flatten(dispatchMock.mock.calls)).toMatchSnapshot();
  });

  describe('updateSubscription', () => {
    it('should dispatch an update subscription action', async() => {
      const dispatchMock = jest.fn((a) => Promise.resolve(a));
      const thunk = billing.updateSubscription({ code: 'test-code' });
      await thunk(dispatchMock);
      expect(_.flatten(dispatchMock.mock.calls)).toMatchSnapshot();
    });

    it('dispatches un update subscription action for aws marketplace account', async() => {
      const dispatchMock = jest.fn((a) => Promise.resolve(a));
      const thunk = billing.updateSubscription({ code: 'test-code', aws: true });
      await thunk(dispatchMock);
      expect(_.flatten(dispatchMock.mock.calls)).toMatchSnapshot();
    });
  });

  describe('addDedicatedIps', () => {
    let dispatchMock;

    beforeEach(() => {
      dispatchMock = jest.fn(() => Promise.resolve());
    });

    it('dispatches with correct data for "normal" account', async() => {
      const thunk = billing.addDedicatedIps({ ip_pool: 'abcd', isAwsAccount: false, quantity: 1 });

      await thunk(dispatchMock);
      expect(_.flatten(dispatchMock.mock.calls)).toMatchSnapshot();
    });

    it('dispatches with correct data for aws account', async() => {
      const thunk = billing.addDedicatedIps({ ip_pool: 'abcd', isAwsAccount: true, quantity: 1 });

      await thunk(dispatchMock);
      expect(_.flatten(dispatchMock.mock.calls)).toMatchSnapshot();
    });
  });

});
