import { createMockStore } from 'src/__testHelpers__/mockStore';
import * as billing from '../billing';
import * as billingHelpers from 'src/helpers/billing';
import _ from 'lodash';
import { isAws } from 'src/helpers/conditions/account';

jest.mock('../helpers/sparkpostApiRequest', () => jest.fn((a) => a));
jest.mock('../helpers/zuoraRequest', () => jest.fn((a) => a));
jest.mock('src/helpers/billing');
jest.mock('src/helpers/conditions/account');

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

    // thunk-friendly dispatch mock
    dispatchMock = jest.fn((a) => typeof a === 'function' ? a(dispatchMock, getStateMock) : Promise.resolve(a));
    getStateMock = jest.fn(() => testState);

    billingHelpers.formatDataForCors = jest.fn((values) => ({ values, corsData, billingData }));
    billingHelpers.formatCreateData = jest.fn(() => ({
      billToContact: {},
      creditCard: {},
      subscription: {}
    }));
    billingHelpers.formatUpdateData = jest.fn((values) => ({ accountKey }));
    isAws.mockImplementation(() => false);
  });

  it('should dispatch a subscription sync action with no params', () => {
    mockStore.dispatch(billing.syncSubscription());
    snapActions();
  });

  it('should dispatch a subscription sync action with meta data param', () => {
    mockStore.dispatch(billing.syncSubscription({ meta: { word: 'test' }}));
    snapActions();
  });

  it('should dispatch an update subscription action and fetch account', async() => {
    const dispatchMock = jest.fn((a) => Promise.resolve(a));
    await billing.updateSubscription({ code: 'test-code' })(dispatchMock, getStateMock);
    expect(_.flatten(dispatchMock.mock.calls)).toMatchSnapshot();
  });

  it('should dispatch an update subscription action with provided onSuccess action', async() => {
    const dispatchMock = jest.fn((a) => Promise.resolve(a));
    await billing.updateSubscription({ code: 'test-code', meta: { onSuccess: jest.fn() }})(dispatchMock, getStateMock);
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

  describe('updateSubscription', () => {
    it('should dispatch an update subscription action', async() => {
      const dispatchMock = jest.fn((a) => Promise.resolve(a));
      const thunk = billing.updateSubscription({ code: 'test-code' });
      await thunk(dispatchMock, getStateMock);
      expect(_.flatten(dispatchMock.mock.calls)).toMatchSnapshot();
    });

    it('dispatches un update subscription action for aws marketplace account', async() => {
      const dispatchMock = jest.fn((a) => Promise.resolve(a));
      isAws.mockImplementation(() => true);
      const thunk = billing.updateSubscription({ code: 'test-code' });
      await thunk(dispatchMock, getStateMock);
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

  describe('collectPayments', () => {
    it('dispatches a collection action', async() => {
      expect(billing.collectPayments()).toMatchSnapshot();
    });

  });

});
