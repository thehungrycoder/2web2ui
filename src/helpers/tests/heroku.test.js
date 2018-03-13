import { loadHerokuToolbar, removeHerokuToolbar } from '../heroku';
import config from 'src/config';
import Cookies from 'js-cookie';
import Boomerang from '@sparkpost/boomerang';
import ErrorTracker from 'src/helpers/errorTracker';

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
  init: jest.fn(),
  reset: jest.fn()
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
  describe('loadHerokuToolbar', () => {
    beforeEach(() => {
      config.heroku = 'those-are-my-cookies';

      const encodedValue = btoa(JSON.stringify(encodedCookie));
      Cookies.get = jest.fn(() => encodedValue);
    });

    it('should initialize the Boomerang bar', () => {
      loadHerokuToolbar();
      expect(Cookies.get).toHaveBeenCalledWith('those-are-my-cookies');
      expect(Boomerang.init).toHaveBeenCalledWith(initObjectArg);
    });

    it('should do nothing if the cookie value is empty', () => {
      Cookies.get = jest.fn(() => undefined);

      loadHerokuToolbar();
      expect(Cookies.get).toHaveBeenCalledWith('those-are-my-cookies');
      expect(Boomerang.init).not.toHaveBeenCalled();
    });
  });

  describe('removeHerokuToolbar', () => {
    let reportSpy;
    const options = { path: '/', domain: 'best.domain' };
    beforeEach(() => {
      reportSpy = jest.spyOn(ErrorTracker, 'report');
      config.heroku = 'those-are-my-cookies';
      config.website.domain = 'best.domain';

      Cookies.remove = jest.fn();
    });

    it('should remove the cookie and bar', () => {
      removeHerokuToolbar();

      expect(Cookies.remove).toBeCalledWith('those-are-my-cookies', options);
      expect(Boomerang.reset).toHaveBeenCalled();
    });

    it('should silently fail and report the error', () => {
      Boomerang.reset = jest.fn(() => { throw new Error('error'); });

      expect(removeHerokuToolbar()).toEqual(undefined);
      expect(Cookies.remove).toBeCalledWith('those-are-my-cookies', options);
      expect(Boomerang.reset).toHaveBeenCalled();
      expect(reportSpy).toHaveBeenCalledWith('remove-heroku-toolbar', Error('error'));
    });
  });
});
