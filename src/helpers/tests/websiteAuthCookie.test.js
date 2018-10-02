import cookieMock from 'js-cookie';
import websiteAuthCookie from '../websiteAuthCookie';
import config from 'src/config';

jest.mock('js-cookie');

describe('Helper: website auth cookie', () => {
  const { name: authCookieName, options: authCookieOptions } = config.authentication.site.cookie;

  it('should save cookie', () => {
    websiteAuthCookie.save({ name: 'fredo' });
    expect(cookieMock.set).toHaveBeenCalledWith(authCookieName, {
      name: 'fredo',
      tenant: config.tenant
    }, authCookieOptions);
  });

  it('should remove cookie', () => {
    websiteAuthCookie.remove();
    expect(cookieMock.remove).toHaveBeenCalledWith(authCookieName, authCookieOptions);
  });
});
