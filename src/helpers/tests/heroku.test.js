import { barMe, unbar } from '../heroku';
import config from 'src/config';
import Cookies from 'js-cookie';

jest.mock('src/config', () => ({
  heroku: {
    cookieName: 'those-are-my-cookies'
  }
}));
jest.mock('js-cookie');

const initObjectArg = {
  app: 'jordan-test',
  addon: 'SparkPost',
  user: undefined,
  org: undefined
};

describe('Heroku Helpers', () => {
  describe('barMe', () => {
    beforeEach(() => {
      window.Boomerang = {
        init: jest.fn()
      };
      config.heroku = 'those-are-my-cookies';

      Cookies.get = jest.fn(() => 'eyJhcHBuYW1lIjoiam9yZGFuLXRlc3QiLCJhZGRvbiI6IlNwYXJrUG9zdCBGcmVlIiwiYWRkb25zIjpbeyJjdXJyZW50Ijp0cnVlLCJpY29uIjoiaHR0cHM6Ly9hZGRvbnMuaGVyb2t1LmNvbS9wcm92aWRlci9hZGRvbnMvc3Bhcmtwb3N0L2ljb25zL21lbnUvcHJvY2Vzc2VkLnBuZyIsInNsdWciOiJzcGFya3Bvc3Q6ZnJlZSIsIm5hbWUiOiJTcGFya1Bvc3QifV19');
    });

    it('should initialize the Boomerang bar', () => {
      expect(barMe()).toEqual(true);
      expect(Cookies.get).toHaveBeenCalledWith('those-are-my-cookies');
      expect(window.Boomerang.init).toHaveBeenCalledWith(initObjectArg);
    });

    it('should do nothing and return false if Boomerang script has not loaded', () => {
      delete window.Boomerang;

      expect(barMe()).toEqual(false);
      expect(Cookies.get).not.toHaveBeenCalled();
    });

    it('should do nothing and return false if the cookie value is empty', () => {
      Cookies.get = jest.fn(() => undefined);

      expect(barMe()).toEqual(false);
      expect(Cookies.get).toHaveBeenCalledWith('those-are-my-cookies');
      expect(window.Boomerang.init).not.toHaveBeenCalled();
    });

    it('should silently fail and return false if the init errors', () => {
      window.Boomerang.init = jest.fn(() => { throw new Error('no heroku 4u'); });

      expect(barMe()).toEqual(false);
      expect(Cookies.get).toHaveBeenCalledWith('those-are-my-cookies');
      expect(window.Boomerang.init).toHaveBeenCalled();
    });
  });

  describe('unbar', () => {
    let remove;
    beforeEach(() => {
      remove = jest.fn();
      document.getElementById = jest.fn(() => ({ remove() { return remove(); } }));

      config.heroku = 'those-are-my-cookies';

      Cookies.remove = jest.fn();
    });

    it('should remove the cookie and bar', () => {
      unbar();

      expect(Cookies.remove).toBeCalledWith('those-are-my-cookies');
      expect(remove).toHaveBeenCalled();
    });

    it('should silently fail', () => {
      Cookies.remove = jest.fn(() => { throw new Error('error'); });

      expect(unbar()).toEqual(undefined);
      expect(Cookies.remove).toBeCalledWith('those-are-my-cookies');
      expect(remove).not.toHaveBeenCalled();
    });
  });
});
