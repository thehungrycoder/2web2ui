import * as tfaActions from '../tfa';
import { sparkpost as spReq } from 'src/helpers/axiosInstances';
import * as authActions from 'src/actions/auth';

jest.mock('src/helpers/axiosInstances');

describe('Action Creator: 2FA', () => {
  let dispatchMock;
  const authData = {
    token: 'token',
    username: 'phoenix',
    refreshToken: 'refresh'
  };

  beforeEach(() => {
    spReq.mockImplementation(() => Promise.resolve());
    dispatchMock = jest.fn((a) => Promise.resolve(a));
  });

  it('should verify tfa and dispatch a login', async() => {
    const loginSpy = jest.spyOn(authActions, 'login');
    const thunk = tfaActions.verifyAndLogin({ authData, code: '23432432' });
    await thunk(dispatchMock);
    expect(loginSpy).toHaveBeenCalledWith({
      authData: {
        access_token: authData.token,
        username: authData.username,
        refresh_token: authData.refreshToken
      },
      saveCookie: true
    });
    expect(dispatchMock.mock.calls).toMatchSnapshot();
  });

  it('should dispatch a failed tfa verification if it fails', async() => {
    spReq.mockImplementation(() => Promise.reject({
      response: {
        data: {
          error_description: 'tfa verify failed'
        }
      }
    }));

    const thunk = tfaActions.verifyAndLogin({ authData, code: '23432432' });
    await thunk(dispatchMock).catch(() => {
      expect(dispatchMock.mock.calls).toMatchSnapshot();
    });
  });

});
