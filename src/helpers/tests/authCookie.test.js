// js-cookie is mocked using jest's magic __mocks__ folder adjacent to node_modules
// https://facebook.github.io/jest/docs/en/manual-mocks.html
import cookieMock from 'js-cookie';
import authCookie from '../authCookie';
import config from 'config/index';

describe('Helper: auth cookie', () => {
  it('should save a cookie using config values', () => {
    const data = {};
    const { name, options } = config.authentication.cookie;
    authCookie.save(data);
    expect(cookieMock.set.callCount).toEqual(1);
    expect(cookieMock.set.args[0]).toEqual([name, data, options]);
  });

  it('should get a cookie', () => {
    const cookieData = {};
    cookieMock.getJSON.returns(cookieData);
    expect(authCookie.get()).toBe(cookieData);
  });

  it('should remove a cookie', () => {
    const { name, options } = config.authentication.cookie;
    authCookie.remove();
    expect(cookieMock.remove.callCount).toEqual(1);
    expect(cookieMock.remove.args[0]).toEqual([name, options]);
  });
});
