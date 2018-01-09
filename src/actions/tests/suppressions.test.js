import sparkpostApiRequest from 'src/actions/helpers/sparkpostApiRequest';
import * as suppressions from '../suppressions';

jest.mock('src/actions/helpers/sparkpostApiRequest');

describe('Action Creator: Suppressions', () => {
  let mockSuppression;
  let dispatchMock;
  let getStateMock;

  beforeEach(() => {
    dispatchMock = jest.fn((a) => Promise.resolve(a));
    getStateMock = jest.fn((a) => Promise.resolve(a));
    mockSuppression = { recipient: 'foo@bar.com', type: 'non_transactional' } ;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('deleteSuppression', () => {
    it('makes api call with correct parameter', async() => {
      const thunk = suppressions.deleteSuppression(mockSuppression);
      await thunk(dispatchMock, getStateMock);
      const args = sparkpostApiRequest.mock.calls[0];
      expect(sparkpostApiRequest).toHaveBeenCalledTimes(1);
      expect(args[0]).toEqual(
        {
          type: 'DELETE_SUPPRESSION',
          meta: {
            method: 'DELETE',
            url: '/suppression-list/foo@bar.com',
            headers: {},
            suppression: mockSuppression
          }
        }
      );
    });

    it('includes subaccount id in header when exists', async() => {
      mockSuppression.subaccount_id = 101;
      const thunk = suppressions.deleteSuppression(mockSuppression);
      await thunk(dispatchMock, getStateMock);
      const args = sparkpostApiRequest.mock.calls[0];
      expect(sparkpostApiRequest).toHaveBeenCalledTimes(1);
      expect(args[0]).toEqual(
        {
          type: 'DELETE_SUPPRESSION',
          meta: {
            method: 'DELETE',
            url: '/suppression-list/foo@bar.com',
            headers: { 'x-msys-subaccount': 101 },
            suppression: mockSuppression
          }
        }
      );
    });

  });

});
