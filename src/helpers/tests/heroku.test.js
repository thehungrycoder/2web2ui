import { barMe, unbar } from '../heroku';
import config from 'src/config';
import Cookies from 'js-cookie';
import Boomerang from '@sparkpost/boomerang';

jest.mock('src/config', () => ({
  heroku: {
    cookieName: 'those-are-my-cookies'
  },
  website: {
    domain: 'best.domain'
  }
}));
jest.mock('js-cookie');
jest.mock('@sparkpost/boomerang', () => ({
  init: jest.fn()
}));

const encodedCookie = {
  appname: 'jordan-test',
  addon: 'SparkPost Free',
  addons:
    [ { current: true,
      icon: 'https://addons.heroku.com/provider/addons/sparkpost/icons/menu/processed.png',
      slug: 'sparkpost:free',
      name: 'SparkPost' } ]
};

const initObjectArg = {
  app: 'jordan-test',
  addon: 'SparkPost',
  user: undefined,
  org: undefined
};

describe('Heroku Helpers', () => {
  describe('barMe', () => {
    beforeEach(() => {
      config.heroku = 'those-are-my-cookies';

      const encodedValue = btoa(JSON.stringify(encodedCookie));
      Cookies.get = jest.fn(() => encodedValue);
    });

    it('should initialize the Boomerang bar', () => {
      barMe();
      expect(Cookies.get).toHaveBeenCalledWith('those-are-my-cookies');
      expect(Boomerang.init).toHaveBeenCalledWith(initObjectArg);
    });

    it('should do nothing if the cookie value is empty', () => {
      Cookies.get = jest.fn(() => undefined);

      barMe();
      expect(Cookies.get).toHaveBeenCalledWith('those-are-my-cookies');
      expect(Boomerang.init).not.toHaveBeenCalled();
    });
  });

  describe('unbar', () => {
    let remove;
    const options = { path: '/', domain: 'best.domain' };
    beforeEach(() => {
      remove = jest.fn();
      document.getElementById = jest.fn(() => ({ remove() { return remove(); } }));

      config.heroku = 'those-are-my-cookies';
      config.website.domain = 'best.domain';

      Cookies.remove = jest.fn();
    });

    it('should remove the cookie and bar', () => {
      unbar();

      expect(Cookies.remove).toBeCalledWith('those-are-my-cookies', options);
      expect(remove).toHaveBeenCalled();
    });

    it('should silently fail', () => {
      Cookies.remove = jest.fn(() => { throw new Error('error'); });

      expect(unbar()).toEqual(undefined);
      expect(Cookies.remove).toBeCalledWith('those-are-my-cookies', options);
      expect(remove).not.toHaveBeenCalled();
    });
  });
});
