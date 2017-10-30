import ErrorTracker, { breadcrumbCallback, getEnricherOrDieTryin } from '../errorTracker';
import * as mockRaven from 'raven-js';

jest.mock('raven-js');

describe('.breadcrumbCallback', () => {
  test('returns false with blacklisted breadcrumb', () => {
    expect(breadcrumbCallback({ message: '@@redux-form/CHANGE' })).toBeFalsy();
  });

  test('returns breadcrumb', () => {
    const breadcrumb = { message: 'RECORD_ME' };
    expect(breadcrumbCallback(breadcrumb)).toEqual(breadcrumb);
  });
});

describe('.getEnricherOrDieTryin', () => {
  const getState = jest.fn();
  const enrich = getEnricherOrDieTryin({ getState });

  beforeEach(() => { getState.mockReset(); });

  test('with current user', () => {
    const currentUser = { access_level: 'admin', customer: '123', username: 'test-user' };
    getState.mockReturnValue({ currentUser });
    expect(enrich({ logger: 'test' })).toEqual({ logger: 'test', user: currentUser });
  });

  test('without current user', () => {
    const currentUser = {};
    getState.mockReturnValue({ currentUser });
    expect(enrich({ logger: 'test' })).toEqual({ logger: 'test', user: currentUser });
  });
});

describe('.install', () => {
  let config, install;
  const store = jest.fn();

  beforeEach(() => {
    config = jest.spyOn(mockRaven, 'config').mockReturnThis();
    install = jest.spyOn(mockRaven, 'install');
  });

  afterEach(() => {
    config.mockRestore();
    install.mockRestore();
  });

  test('does nothing when not configured', () => {
    ErrorTracker.install({}, store);
    expect(config).not.toHaveBeenCalled();
  });

  test('installs error tracking service with configuration', () => {
    ErrorTracker.install({ sentry: {}}, store);
    expect(config).toHaveBeenCalled();
  });
});

describe('.report', () => {
  let captureException, isSetup;
  const error = new Error('Oh no!');

  beforeEach(() => {
    captureException = jest.spyOn(mockRaven, 'captureException');
    isSetup = jest.spyOn(mockRaven, 'isSetup');
  });

  afterEach(() => {
    captureException.mockRestore();
    isSetup.mockRestore();
  });

  test('does nothing when not setup', () => {
    isSetup.mockReturnValue(false);
    ErrorTracker.report('test-logger', error);
    expect(captureException).not.toHaveBeenCalled();
  });

  test('sends error when setup', () => {
    isSetup.mockReturnValue(true);
    ErrorTracker.report('test-logger', error);
    expect(captureException).toHaveBeenCalledWith(error, { logger: 'test-logger' });
  });
});
