import * as billing from '../billing';
// import { fetch } from '../account';
import billingCreate from '../billingCreate';
import { isAws } from '../../helpers/conditions/account';
import * as billingHelpers from '../../helpers/billing';
import _ from 'lodash';
// import * as actionHelper from '../helpers/chainActions';

jest.mock('src/helpers/billing');
jest.mock('src/helpers/conditions/account');
jest.mock('../helpers/sparkpostApiRequest', () => jest.fn((a) => a));
jest.mock('../helpers/zuoraRequest', () => jest.fn((a) => a));

describe('Action Creator: Billing Create', () => {
  let token;
  let signature;
  let corsData;
  let billingData;
  let testState;
  let dispatchMock;
  let getStateMock;
  // let chainActionsMock;

  beforeEach(() => {
    corsData = { some: 'test-cors-data' };
    billingData = { some: 'test-billing-data', billToContact: {}};
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

    isAws.mockImplementation(() => false);
    billing.cors = jest.fn(({ meta }) => ({ token, signature, meta }));
    billing.createZuoraAccount = jest.fn(({ meta }) => ({ meta }));
    billing.syncSubscription = jest.fn(({ meta }) => ({ meta }));
    // fetch = jest.fn(({ meta }) => ({ meta }));
    // chainActionsMock = jest.genMockFromModule('src/actions/helpers/chainActions').default;
    // chainActionsMock = jest.spyOn(actionHelper, 'default');
  });

  it('should dispatch a chained billing create action', async() => {
    await billingCreate({ some: 'test-values' })(dispatchMock, getStateMock);
    // expect(billing.cors).toHaveBeenCalledWith({ meta: { onSuccess: () => {} }, context: 'update-billing', data: { some: 'test-cors-data' }});
    // expect(billing.cors).toHaveBeenCalled();
    // expect(billing.createZuoraAccount).toHaveBeenCalled();
    // expect(billing.createZuoraAccount.mock.calls[0][0].data.billToContact).toEqual('sparkpost-user-email@example.com');
    // expect(billing.syncSubscription).toHaveBeenCalled();
    // expect(fetch).toHaveBeenCalled();
    // expect(chainActionsMock).toHaveBeenCalledWith('stuff');
    expect(_.flatten(dispatchMock.mock.calls)).toMatchSnapshot();
  });

  it('should update instead of create if account is AWS', () => {
    isAws.mockImplementation(() => true);
    billingCreate({ planpicker: { code: 'newplan1' }})(dispatchMock, getStateMock);
    // const update = dispatchMock.mock.calls[0][0];
    // expect(update).toEqual(expect.any(Function));
    // update(dispatchMock, getStateMock);
    expect(_.flatten(dispatchMock.mock.calls)).toMatchSnapshot();
  });
});
