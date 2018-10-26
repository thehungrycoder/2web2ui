import sparkpostApiRequest from 'src/actions/helpers/sparkpostApiRequest';
import * as suppressions from '../suppressions';
import csvFileParseRequest, { hasField } from 'src/actions/helpers/csvFileParseRequest';

jest.mock('src/actions/helpers/sparkpostApiRequest', () => jest.fn((a) => a));
jest.mock('src/actions/helpers/csvFileParseRequest');

// Have to manually mock to avoid overrite of named exports
csvFileParseRequest.mockImplementation((a) => a);
hasField.mockImplementation((a) => jest.fn(a));

describe('Action Creator: Suppressions', () => {
  describe('deleteSuppression', () => {
    let mockSuppression;

    beforeEach(() => {
      mockSuppression = { recipient: 'foo@bar.com', type: 'non_transactional' } ;
    });

    it('makes api call with correct parameter', async () => {
      await suppressions.deleteSuppression(mockSuppression);
      expect(sparkpostApiRequest).toHaveBeenCalledTimes(1);
      expect(sparkpostApiRequest).toHaveBeenCalledWith(
        {
          type: 'DELETE_SUPPRESSION',
          meta: {
            method: 'DELETE',
            url: '/v1/suppression-list/foo@bar.com',
            headers: {},
            data: { type: mockSuppression.type },
            suppression: mockSuppression
          }
        }
      );
    });

    it('includes subaccount id in header when exists', async () => {
      mockSuppression.subaccount_id = 101;
      await suppressions.deleteSuppression(mockSuppression);
      expect(sparkpostApiRequest).toHaveBeenCalledTimes(1);
      expect(sparkpostApiRequest).toHaveBeenCalledWith(
        {
          type: 'DELETE_SUPPRESSION',
          meta: {
            method: 'DELETE',
            url: '/v1/suppression-list/foo@bar.com',
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

    it('transforms deprecated email to recipient field', () => {
      const action = suppressions.createOrUpdateSuppressions([
        { email: 'example@test.com', type: 'transactional' }
      ]);

      expect(action).toMatchSnapshot();
    });

    it('ignores deprecated email field when recipient field is present', () => {
      const action = suppressions.createOrUpdateSuppressions([
        { email: 'old@test.com', recipient: 'example@test.com', type: 'transactional' }
      ]);

      expect(action).toMatchSnapshot();
    });

    it('transforms deprecated non_transactional and transactional fields to type', () => {
      const action = suppressions.createOrUpdateSuppressions([
        { recipient: 'example@test.com', non_transactional: 'true', transactional: 'false' },
        { recipient: 'example@test.com', non_transactional: 'false', transactional: 'true' }
      ]);

      expect(action).toMatchSnapshot();
    });

    it('ignores non_transactional and transactional fields when type is present', () => {
      const action = suppressions.createOrUpdateSuppressions([
        {
          recipient: 'transactional@test.com',
          non_transactional: 'true',
          transactional: 'false',
          type: 'transactional'
        },
        {
          recipient: 'non_transactional@test.com',
          non_transactional: 'false',
          transactional: 'true',
          type: 'non_transactional'
        }
      ]);

      expect(action).toMatchSnapshot();
    });

    it('transform non-standard type field values', () => {
      const action = suppressions.createOrUpdateSuppressions([
        { recipient: 'example@test.com', type: 'non_marketing' },
        { recipient: 'example@test.com', type: 'marketing' }
      ]);

      expect(action).toMatchSnapshot();
    });
  });

  describe('parseSuppressionsFile', () => {
    it('request to parse local file', () => {
      const localFile = { name: 'example.csv', size: 123 };
      const action = suppressions.parseSuppressionsFile(localFile);

      expect(hasField).toHaveBeenCalledWith('recipient', 'email');
      expect(hasField).toHaveBeenCalledWith('type', 'non_transactional', 'transactional');
      expect(action).toMatchSnapshot();
    });
  });

  describe('uploadSuppressions', () => {
    it('parses local file and creates suppressions', async () => {
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
