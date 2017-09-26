import cookieMock from 'js-cookie';
import authCookie from '../authCookie';
import config from 'src/config';

jest.mock('js-cookie');

describe('Helper: auth cookie', () => {
  it('should save a cookie using config values', () => {
    const data = {};
    const { name, options } = config.authentication.cookie;
    authCookie.save(data);
    expect(cookieMock.set).toHaveBeenCalledWith(name, data, options);
  });

  it('should get a cookie', () => {
    const cookieData = {};
    cookieMock.getJSON.mockReturnValue(cookieData);
    expect(authCookie.get()).toBe(cookieData);
  });

  it('should remove a cookie', () => {
    const { name, options } = config.authentication.cookie;
    authCookie.remove();
    expect(cookieMock.remove).toHaveBeenCalledWith(name, options);
  });
});
