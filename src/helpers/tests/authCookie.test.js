import cookieMock from 'js-cookie';
import authCookie from '../authCookie';
import config from 'src/config';

jest.mock('js-cookie');

describe('Helper: auth cookie', () => {
  const { name: authCookieName, options: authCookieOptions } = config.authentication.app.cookie;

  it('should save auth cookie using config values', () => {
    const data = {};
    authCookie.save(data);
    expect(cookieMock.set).toHaveBeenCalledWith(authCookieName, data, authCookieOptions);
  });

  it('should get a cookie', () => {
    const data = {};
    cookieMock.getJSON.mockReturnValue(data);
    expect(authCookie.get()).toBe(data);
  });

  it('should remove both auth and website cookies', () => {
    authCookie.remove();
    expect(cookieMock.remove).toHaveBeenCalledWith(authCookieName, authCookieOptions);
  });
});
