/* eslint-disable max-lines */
import sparkpostApiRequest, { refreshing, refreshTokensUsed } from '../sparkpostApiRequest';
import SparkpostApiError from '../sparkpostApiError';
import { createMockStore } from 'src/__testHelpers__/mockStore';
import * as axiosMocks from 'src/helpers/axiosInstances';
import * as authMock from 'src/actions/auth';
import * as globalAlertMock from 'src/actions/globalAlert';
import * as httpHelpersMock from 'src/helpers/http';
import * as accountActions from 'src/actions/account';

jest.mock('src/helpers/axiosInstances');
jest.mock('src/actions/auth');
jest.mock('src/actions/globalAlert');
jest.mock('src/actions/account');
jest.mock('src/helpers/http');

describe('Helper: SparkPost API Request', () => {

  let meta;
  let results;
  let state;
  let action;
  let refreshData;

  let mockStore;

  beforeEach(() => {
    state = { auth: { loggedIn: true, token: 'TEST-TOKEN' }, account: { status: 'active' }};
    mockStore = createMockStore(state);

    meta = { url: '/some/path', method: 'GET' };
    action = { type: 'TEST', meta };
    results = [];
    authMock.logout = jest.fn(() => ({ type: 'LOGOUT' }));

    axiosMocks.sparkpost.mockImplementation(() => Promise.resolve({ data: { results }}));
    globalAlertMock.showAlert = jest.fn(() => ({ type: 'SHOW_ALERT' }));
    accountActions.fetch = jest.fn(() => ({ type: 'FETCH_ACCOUNT' }));
  });

  it('should successfully call the API', async () => {
    const actualResults = await mockStore.dispatch(sparkpostApiRequest(action));

    expect(actualResults).toBe(results);
    expect(mockStore.getActions()).toMatchSnapshot();
    expect(axiosMocks.sparkpost).toHaveBeenCalledWith(expect.objectContaining({
      method: 'get',
      url: '/some/path',
      headers: { Authorization: 'TEST-TOKEN' }
    }));
  });

  it('should successfully call the API with a non-json response type', async () => {
    const blobData = 'blob data';

    axiosMocks.sparkpost.mockImplementation(() => Promise.resolve({ data: blobData }));
    meta.responseType = 'blob';

    await mockStore.dispatch(sparkpostApiRequest(action));

    expect(mockStore.getActions()).toMatchSnapshot();
    expect(axiosMocks.sparkpost).toHaveBeenCalledWith(expect.objectContaining({
      method: 'get',
      url: '/some/path',
      responseType: 'blob',
      headers: { Authorization: 'TEST-TOKEN' }
    }));
  });

  it('should successfully call the API when the data response is null', async () => {

    axiosMocks.sparkpost.mockImplementation(() => Promise.resolve({ data: null }));

    await mockStore.dispatch(sparkpostApiRequest(action));

    expect(mockStore.getActions()).toMatchSnapshot();
    expect(axiosMocks.sparkpost).toHaveBeenCalledWith(expect.objectContaining({
      method: 'get',
      url: '/some/path',
      headers: { Authorization: 'TEST-TOKEN' }
    }));
  });

  it('should get the correct response when response object has links and total_count', async () => {

    axiosMocks.sparkpost.mockImplementation(() => Promise.resolve({ data: { results: [], links: { next: '' }, total_count: 0 }}));

    await mockStore.dispatch(sparkpostApiRequest(action));

    expect(mockStore.getActions()).toMatchSnapshot();
    expect(axiosMocks.sparkpost).toHaveBeenCalledWith(expect.objectContaining({
      method: 'get',
      url: '/some/path',
      headers: { Authorization: 'TEST-TOKEN' }
    }));
  });

  describe('failure cases', () => {

    let apiErr;

    beforeEach(() => {
      const error = new Error('API call failed');
      error.response = { status: 400, data: { results }};
      apiErr = new SparkpostApiError(error);

      axiosMocks.sparkpost.mockImplementation(() => Promise.reject(apiErr));
      refreshTokensUsed.clear();
      globalAlertMock.showAlert = jest.fn((a) => a);
    });

    it('should handle a failed API call', async () => {
      await expect(mockStore.dispatch(sparkpostApiRequest(action))).rejects.toThrow(apiErr);
      expect(globalAlertMock.showAlert).toHaveBeenCalledWith({
        type: 'error',
        message: 'Something went wrong.',
        details: apiErr.message
      });
      expect(mockStore.getActions()).toMatchSnapshot();
    });

    it('should not show error alert when request failed', async () => {
      action.meta.showErrorAlert = false;
      await expect(mockStore.dispatch(sparkpostApiRequest(action))).rejects.toThrow(apiErr);
      expect(mockStore.getActions()).toMatchSnapshot();
    });

    it('should not show an error alert when a GET returns 404', async () => {
      action.meta.showErrorAlert = false;
      action.meta.method = 'GET';
      apiErr.response.status = 404;
      await expect(mockStore.dispatch(sparkpostApiRequest(action))).rejects.toThrow(apiErr);
      expect(mockStore.getActions()).toMatchSnapshot();
    });

    it('should dispatch a special 5xx error action', async () => {
      apiErr.response.status = 500;

      await expect(mockStore.dispatch(sparkpostApiRequest(action))).rejects.toThrow(apiErr);
      expect(globalAlertMock.showAlert).toHaveBeenCalledWith({
        type: 'error',
        message: 'Something went wrong.',
        details: apiErr.message
      });
      expect(mockStore.getActions()).toMatchSnapshot();
    });

    it('should fetch account on a 403', async () => {
      apiErr.response.status = 403;
      try {
        await mockStore.dispatch(sparkpostApiRequest(action));
      } catch (err) {
        expect(err).toEqual(apiErr);
        expect(authMock.logout).not.toHaveBeenCalled();
        expect(accountActions.fetch).toHaveBeenCalledTimes(1);
        expect(mockStore.getActions()).toMatchSnapshot();
      }
    });

    it('should dispatch a logout action on a 401 with no refresh token', async () => {
      apiErr.response.status = 401;

      await expect(mockStore.dispatch(sparkpostApiRequest(action))).rejects.toThrow(apiErr);
      expect(authMock.logout).toHaveBeenCalledTimes(1);
      expect(mockStore.getActions()).toMatchSnapshot();
    });

    describe('with refresh tokens', () => {

      beforeEach(() => {
        state.auth.refreshToken = 'REFRESH_1';
        mockStore = createMockStore(state);
        apiErr.response.status = 401;
        refreshData = { access_token: 'NEW_TOKEN' };
        httpHelpersMock.useRefreshToken = jest.fn(() => Promise.resolve({ data: refreshData }));
        authMock.refresh = jest.fn(() => ({ type: 'REFRESH' }));
      });

      it('should get a refresh token and re-dispatch', async () => {
        axiosMocks.sparkpost
          .mockImplementationOnce(() => Promise.reject(apiErr))
          .mockImplementation(() => Promise.resolve({ data: { results }}));

        await mockStore.dispatch(sparkpostApiRequest(action));
        expect(httpHelpersMock.useRefreshToken).toHaveBeenCalledTimes(1);
        expect(httpHelpersMock.useRefreshToken).toHaveBeenCalledWith('REFRESH_1');
        expect(authMock.refresh).toHaveBeenCalledWith('NEW_TOKEN', 'REFRESH_1');
        expect(action.meta.retries).toEqual(1);

        expect(mockStore.getActions()).toMatchSnapshot();
      });

      it('should only request one refresh token at a time', async () => {
        axiosMocks.sparkpost
          .mockImplementationOnce(() => Promise.reject(apiErr))
          .mockImplementationOnce(() => Promise.reject(apiErr))
          .mockImplementationOnce(() => Promise.reject(apiErr))
          .mockImplementation(() => Promise.resolve({ data: { results }}));

        await Promise.all([
          mockStore.dispatch(sparkpostApiRequest({ type: 'TEST_WITH_REFRESH', meta: {}})),
          mockStore.dispatch(sparkpostApiRequest({ type: 'TEST_NO_REFRESH', meta: {}})),
          mockStore.dispatch(sparkpostApiRequest({ type: 'TEST_NO_REFRESH', meta: {}}))
        ]);

        expect(httpHelpersMock.useRefreshToken).toHaveBeenCalledTimes(1);
        expect(httpHelpersMock.useRefreshToken).toHaveBeenCalledWith('REFRESH_1');
        expect(authMock.refresh).toHaveBeenCalledWith('NEW_TOKEN', 'REFRESH_1');

        // checking action counts instead of snapshotting them in order because these
        // are "kind of async" so they can sometimes get out of order and fail the snapshot
        const actions = mockStore.getActions();
        const byType = (keep) => ({ type }) => type === keep;
        expect(actions.filter(byType('TEST_WITH_REFRESH_PENDING'))).toHaveLength(2);
        expect(actions.filter(byType('TEST_WITH_REFRESH_SUCCESS'))).toHaveLength(1);
        expect(actions.filter(byType('REFRESH'))).toHaveLength(1);
        expect(actions.filter(byType('TEST_NO_REFRESH_PENDING'))).toHaveLength(4);
        expect(actions.filter(byType('TEST_NO_REFRESH_SUCCESS'))).toHaveLength(2);
      });

      it('should only retry 3 times', async () => {
        authMock.refresh.mockImplementation(() => {
          refreshTokensUsed.clear(); // have to do this since state always returns original refresh token
          return { type: 'REFRESH' };
        });

        try {
          await mockStore.dispatch(sparkpostApiRequest({ type: 'TEST_MAX_RETRIES', meta: {}}));
        } catch (err) {
          expect(httpHelpersMock.useRefreshToken).toHaveBeenCalledTimes(3);
          expect(httpHelpersMock.useRefreshToken).toHaveBeenCalledWith('REFRESH_1');
          expect(authMock.refresh).toHaveBeenCalledWith('NEW_TOKEN', 'REFRESH_1');
          expect(mockStore.getActions()).toMatchSnapshot();
        }
      });

      it('should only retry once with the same token', async () => {
        try {
          await mockStore.dispatch(sparkpostApiRequest({ type: 'TEST_ONE_RETRY_PER_TOKEN', meta: {}}));
        } catch (err) {
          expect(httpHelpersMock.useRefreshToken).toHaveBeenCalledTimes(1);
          expect(mockStore.getActions()).toMatchSnapshot();
        }
      });

      it('should log out if refresh fails', async () => {
        const refreshErr = new Error();
        httpHelpersMock.useRefreshToken = jest.fn(() => Promise.reject(refreshErr));

        try {
          await mockStore.dispatch(sparkpostApiRequest({ type: 'TEST_REFRESH_FAILED', meta: {}}));
        } catch (err) {
          expect(refreshing).toEqual(false);
          expect(err).toBe(refreshErr);
          expect(authMock.logout).toHaveBeenCalledTimes(1);
        }
      });

    });

  });
});
