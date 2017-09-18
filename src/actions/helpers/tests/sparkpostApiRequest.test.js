import sparkpostApiRequest from '../sparkpostApiRequest';
import * as axiosMocks from '../axiosInstances';
import * as authMock from 'actions/auth';
import * as apiFailureMock from 'actions/apiFailure';
import * as httpHelpersMock from 'helpers/http';

jest.mock('../axiosInstances');
jest.mock('actions/auth');
jest.mock('actions/apiFailure');
jest.mock('helpers/http');

describe('Helper: SparkPost API Request', () => {

  let meta;
  let dispatchMock;
  let getStateMock;
  let results;
  let state;
  let action;
  let thunk;

  expect.hasAssertions();
  
  beforeEach(() => {
    jest.clearAllMocks();

    meta = { url: '/some/path', method: 'GET' };
    action = { type: 'TEST', meta };
    dispatchMock = jest.fn((a) => a);
    state = { auth: { loggedIn: true, token: 'TEST-TOKEN' }};
    getStateMock = jest.fn(() => state);
    results = [];

    axiosMocks.sparkpost.mockImplementation(() => Promise.resolve({ data: { results }}));
    thunk = sparkpostApiRequest(action);
  });

  it('should successfully call the API', () => {
    return thunk(dispatchMock, getStateMock)
      .then((actualResults) => {
        expect(actualResults).toBe(results);
        expect(dispatchMock).toHaveBeenCalledTimes(2);
        expect(dispatchMock.mock.calls).toMatchSnapshot();
        expect(axiosMocks.sparkpost).toHaveBeenCalledWith(expect.objectContaining({
          method: 'get',
          url: '/some/path',
          headers: { Authorization: 'TEST-TOKEN' }
        }));
      });
  });

  describe('failures', () => {

    let apiErr;

    beforeEach(() => {
      apiErr = new Error('API call failed');
      apiErr.response = { status: 400, data: { results }};
      axiosMocks.sparkpost.mockImplementation(() => Promise.reject(apiErr));
    });

    it('should handle a failed API call', () => {
      return thunk(dispatchMock, getStateMock)
        .catch((err) => {
          expect(err).toBe(apiErr);
          expect(dispatchMock).toHaveBeenCalledTimes(2);
          expect(dispatchMock.mock.calls).toMatchSnapshot();
        });
    });

    it('should dispatch a special 5xx error action', () => {
      apiErr.response.status = 500;
      return thunk(dispatchMock, getStateMock)
        .catch((err) => {
          const { message, response } = err;
          expect(err).toBe(apiErr);
          expect(dispatchMock).toHaveBeenCalledTimes(3);
          expect(apiFailureMock.received).toHaveBeenCalledWith({ message, response }, meta);
        });
    });

    it('should dispatch a logout action on a 403 response', () => {
      apiErr.response.status = 403;
      return thunk(dispatchMock, getStateMock)
        .catch(() => {
          expect(dispatchMock).toHaveBeenCalledTimes(2);
          expect(authMock.logout).toHaveBeenCalledTimes(1);
        });
    });

    it('should dispatch a logout action on a 401 with no refresh token', () => {
      apiErr.response.status = 401;
      return thunk(dispatchMock, getStateMock)
        .catch(() => {
          expect(dispatchMock).toHaveBeenCalledTimes(2);
          expect(authMock.logout).toHaveBeenCalledTimes(1);
        });
    });

    it('should get a refresh token and re-dispatch', async () => {
      apiErr.response.status = 401;
      state.auth.refreshToken = 'REFRESH_1';
      const data = { access_token: 'NEW_TOKEN', refresh_token: 'REFRESH_2' };
      httpHelpersMock.useRefreshToken.mockImplementation(() => Promise.resolve({ data }));
      authMock.refresh.mockImplementation(() => Promise.resolve());
      axiosMocks.sparkpost
        .mockImplementationOnce(() => Promise.reject(apiErr))
        .mockImplementation(() => Promise.resolve({ data: { results }}));
      
      const rethunk = await thunk(dispatchMock, getStateMock);
        // .then((rethunk) => {
      expect(dispatchMock).toHaveBeenCalledTimes(2);
      expect(httpHelpersMock.useRefreshToken).toHaveBeenCalledTimes(1);
      expect(httpHelpersMock.useRefreshToken).toHaveBeenCalledWith('REFRESH_1');
      expect(authMock.refresh).toHaveBeenCalledWith('NEW_TOKEN', 'REFRESH_2');
      expect(action.meta.retries).toEqual(1);

      await rethunk(dispatchMock, getStateMock);
            // .then(() => {
      expect(dispatchMock).toHaveBeenCalledTimes(4);
      expect(dispatchMock.mock.calls).toMatchSnapshot();
            // });
        // });
    });
  });
});