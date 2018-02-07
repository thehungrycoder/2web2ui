import sparkpostApiRequest from 'src/actions/helpers/sparkpostApiRequest';
import * as suppressions from '../suppressions';

jest.mock('src/actions/helpers/sparkpostApiRequest', () => jest.fn((a) => a));
jest.mock('src/actions/helpers/localFileParseRequest', () => jest.fn((a) => a));

describe('Action Creator: Suppressions', () => {
  describe('deleteSuppression', () => {
    let mockSuppression;

    beforeEach(() => {
      mockSuppression = { recipient: 'foo@bar.com', type: 'non_transactional' } ;
    });

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

  describe('createOrUpdateSuppressions', () => {
    let recipients;

    beforeEach(() => {
      recipients = [{ recipient: ' example@test.com ', type: 'transactional' }];
    });

    it('without a subaccount', () => {
      const action = suppressions.createOrUpdateSuppressions(recipients);
      expect(action).toMatchSnapshot();
    });

    it('with a subaccount', () => {
      const subaccount = 999;
      const action = suppressions.createOrUpdateSuppressions(recipients, subaccount);

      expect(action).toMatchSnapshot();
    });
  });

  describe('parseSuppressionsFile', () => {
    it('request to parse local file', () => {
      const localFile = { name: 'example.csv', size: 123 };
      const action = suppressions.parseSuppressionsFile(localFile);
      expect(action).toMatchSnapshot();
    });
  });

  describe('uploadSuppressions', () => {
    it('parses local file and creates suppressions', async() => {
      const localFile = { name: 'example.csv', size: 123 };
      const recipients = [{ recipient: ' example@test.com ', type: 'transactional' }];
      const subaccount = 999;
      const mockDispatch = jest.fn(() => Promise.resolve())
        .mockImplementationOnce(() => Promise.resolve(recipients));
      const thunk = suppressions.uploadSuppressions(localFile, subaccount);

      await thunk(mockDispatch);

      expect(mockDispatch.mock.calls).toMatchSnapshot();
    });
  });
});
