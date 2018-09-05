import { authenticate, refresh, login, logout } from '../websiteAuth';
import { sparkpostLogin, useRefreshToken } from 'src/helpers/http';
import siteCookie from 'src/helpers/websiteAuthCookie';

jest.mock('src/helpers/http');
jest.mock('src/helpers/websiteAuthCookie');

describe('Action Creator: Website Auth', () => {
  let dispatchMock;
  let getStateMock;
  let stateMock;

  const apiResponse = { data: 'yay' };
  const apiError = {
    response: {
      data: {
        error_description: 'boom'
      }
    }
  };

  beforeEach(() => {
    dispatchMock = jest.fn((a) => Promise.resolve(a));

    stateMock = { websiteAuth: { refreshToken: 'refreshToken' }};

    getStateMock = jest.fn(() => stateMock);
  });

  describe('authenticate', () => {
    it('should dispatch success', async () => {
      sparkpostLogin.mockResolvedValue(apiResponse);
      const thunk = authenticate('user', 'pass', true);
      await thunk(dispatchMock);
      expect(dispatchMock).toHaveBeenCalledWith({
        type: 'WEBSITE_AUTH_SUCCESS',
        payload: 'yay'
      });
    });

    it('should dispatch failure', async () => {
      sparkpostLogin.mockRejectedValue(apiError);
      const thunk = authenticate('user', 'pass', true);
      await thunk(dispatchMock);
      expect(dispatchMock).toHaveBeenCalledWith({
        type: 'WEBSITE_AUTH_FAIL',
        payload: { errorDescription: 'boom' }
      });
    });
  });

  describe('login', () => {
    it('should not save cookie by default', () => {
      login(false)(dispatchMock, getStateMock);
      expect(siteCookie.save).toHaveBeenCalledTimes(0);
    });

    it('should save cookie if able', () => {
      login(true)(dispatchMock, getStateMock);
      expect(siteCookie.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('refresh', () => {
    it('should dispatch success', async () => {
      useRefreshToken.mockResolvedValue(apiResponse);
      const thunk = refresh();
      await thunk(dispatchMock, getStateMock);
      expect(dispatchMock).toHaveBeenCalledWith({
        type: 'WEBSITE_AUTH_SUCCESS',
        payload: 'yay'
      });
    });

    it('should dispatch failure', async () => {
      useRefreshToken.mockRejectedValue(apiError);
      const thunk = refresh();
      await thunk(dispatchMock, getStateMock);
      expect(dispatchMock).toHaveBeenCalledWith({
        type: 'WEBSITE_AUTH_FAIL',
        payload: { errorDescription: 'boom' }
      });
    });
  });

  describe('logout', () => {
    it('should remove cookie', () => {
      logout();
      expect(siteCookie.remove).toHaveBeenCalledTimes(1);
    });
  });
});
