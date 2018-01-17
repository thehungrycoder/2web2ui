import sparkpostApiRequest from 'src/actions/helpers/sparkpostApiRequest';
import * as suppressions from '../suppressions';

jest.mock('src/actions/helpers/sparkpostApiRequest');

describe('Action Creator: Suppressions', () => {
  let mockSuppression;

  beforeEach(() => {
    mockSuppression = { recipient: 'foo@bar.com', type: 'non_transactional' } ;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('deleteSuppression', () => {
    it('makes api call with correct parameter', async() => {
      await suppressions.deleteSuppression(mockSuppression);
      expect(sparkpostApiRequest).toHaveBeenCalledTimes(1);
      expect(sparkpostApiRequest).toHaveBeenCalledWith(
        {
          type: 'DELETE_SUPPRESSION',
          meta: {
            method: 'DELETE',
            url: '/suppression-list/foo@bar.com',
            headers: {},
            data: { type: mockSuppression.type },
            suppression: mockSuppression
          }
        }
      );
    });

    it('includes subaccount id in header when exists', async() => {
      mockSuppression.subaccount_id = 101;
      await suppressions.deleteSuppression(mockSuppression);
      expect(sparkpostApiRequest).toHaveBeenCalledTimes(1);
      expect(sparkpostApiRequest).toHaveBeenCalledWith(
        {
          type: 'DELETE_SUPPRESSION',
          meta: {
            method: 'DELETE',
            url: '/suppression-list/foo@bar.com',
            headers: { 'x-msys-subaccount': 101 },
            data: { type: mockSuppression.type },
            suppression: mockSuppression
          }
        }
      );
    });

  });

});
