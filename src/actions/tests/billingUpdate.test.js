import billingUpdate from '../billingUpdate';
import * as billingHelpers from '../../helpers/billing';
import _ from 'lodash';

jest.mock('src/helpers/billing');
jest.mock('src/helpers/conditions/account');
jest.mock('../helpers/sparkpostApiRequest', () => jest.fn((a) => a));
jest.mock('../helpers/zuoraRequest', () => jest.fn((a) => a));

describe('Action Creator: Billing Create', () => {
  let accountKey;
  let testState;
  let dispatchMock;
  let getStateMock;

  beforeEach(() => {
    accountKey = { some: 'test-billing-data' };
    // corsData = { some: 'test-cors-data' };
    // billingData = { some: 'test-billing-data', billToContact: {}};
    testState = {
      currentUser: {
        email: 'sparkpost-user-email@example.com'
      }
    };

    // thunk-friendly dispatch mock
    dispatchMock = jest.fn((a) => typeof a === 'function' ? a(dispatchMock, getStateMock) : Promise.resolve(a));
    getStateMock = jest.fn(() => testState);
    billingHelpers.formatUpdateData = jest.fn((values) => ({ accountKey }));
  });


  it('should dispatch a chained billing update action', async() => {
    await billingUpdate({ planpicker: { code: 'test-plan' }})(dispatchMock, getStateMock);
    expect(_.flatten(dispatchMock.mock.calls)).toMatchSnapshot();
  });

});
