import cookieMock from 'js-cookie';
import authCookie from '../authCookie';
import config from 'src/config';

jest.mock('js-cookie');

describe('Helper: auth cookie', () => {
  const { name: authCookieName, options: authCookieOptions } = config.authentication.cookie;
  const { name: websiteCookieName, options: websiteCookieOptions } = config.website.cookie;

  it('should save both auth and website cookies using config values', () => {
    const data = {};
    authCookie.save(data);
    expect(cookieMock.set).toHaveBeenCalledWith(authCookieName, data, authCookieOptions);
    expect(cookieMock.set).toHaveBeenCalledWith(websiteCookieName, data, websiteCookieOptions);
  });

  it('should get a cookie', () => {
    const data = {};
    cookieMock.getJSON.mockReturnValue(data);
    expect(authCookie.get()).toBe(data);
  });

  it('should remove both auth and website cookies', () => {
    authCookie.remove();
    expect(cookieMock.remove).toHaveBeenCalledWith(authCookieName, authCookieOptions);
    expect(cookieMock.remove).toHaveBeenCalledWith(websiteCookieName, websiteCookieOptions);
  });
});
