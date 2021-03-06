import cases from 'jest-in-case';
import ErrorTracker, {
  breadcrumbCallback, getEnricherOrDieTryin, isApiError, isErrorFromOurBundle, isChunkFailure
} from '../errorTracker';
import * as mockRaven from 'raven-js';

jest.mock('raven-js');
jest.mock('bowser', () => ({
  getParser: jest.fn(() => ({
    satisfies: jest.fn(() => true)
  }))
}));

describe('.breadcrumbCallback', () => {
  it('returns false with blacklisted breadcrumb', () => {
    expect(breadcrumbCallback({ message: '@@redux-form/CHANGE' })).toBeFalsy();
  });

  it('returns breadcrumb', () => {
    const breadcrumb = { message: 'RECORD_ME' };
    expect(breadcrumbCallback(breadcrumb)).toEqual(breadcrumb);
  });
});

cases('.getEnricherOrDieTryin', ({ currentWindow = {}, data = {}, state = {}}) => {
  const getState = jest.fn(() => state);
  const enrich = getEnricherOrDieTryin({ getState }, currentWindow);

  expect(enrich({ logger: 'test', ...data })).toMatchSnapshot();
}, {
  'by default': {},
  'with current user': {
    state: {
      currentUser: {
        id: 123, // should be ignored
        access_level: 'admin',
        customer: 123,
        username: 'test-user'
      }
    }
  },
  'with document language': {
    currentWindow: {
      document: {
        documentElement: { lang: 'af' }
      }
    }
  },
  'with navigator language': {
    currentWindow: {
      navigator: { language: 'en-US' }
    }
  },
  'with tags': {
    data: {
      tags: { tenant: 'test' }
    }
  },
  'with error from our bundle': {
    data: {
      exception: {
        values: [{
          stacktrace: {
            frames: [
              { filename: 'sparkpost.com/static/js/bundle.js', function: 'test' }
            ]
          }
        }]
      }
    }
  },
  'with api error': {
    data: {
      exception: {
        type: 'SparkpostApiError'
      }
    }
  },
  'with chunk loading error': {
    data: {
      exception: {
        values: [{
          value: 'Loading chunk 4 failed.'
        }]
      }
    }
  },
  'with password reset token': {
    data: {
      request: {
        url: 'https://not-a-real-tenant.example.com/reset-password/long-secret-reset-token'
      }
    }
  },
  'with email verification token': {
    data: {
      request: {
        url: 'https://not-a-real-tenant.example.com/account/email-verification/long-verification-token'
      }
    }
  },
  'with other request fields': {
    data: {
      request: {
        url: 'https://not-a-real-tenant.example.com/nice-route',
        headers: {
          Referer: 'https://not-a-real-tenant.example.com/nice-route',
          'User-Agent': 'Probably not Mozilla really'
        }
      }
    }
  },
  'with referer header': {
    data: {
      request: {
        url: 'https://not-a-real-tenant.example.com/account/email-verification/long-verification-token',
        headers: {
          Referer: 'https://not-a-real-tenant.example.com/account/email-verification/long-verification-token',
          'User-Agent': 'Probably not Mozilla really'
        }
      }
    }
  },
  'without headers': {
    data: {
      request: {
        url: 'https://not-a-real-tenant.example.com/nice-route'
      }
    }
  },
  'without request object': {
    data: {
      otherField: 'blue'
    }
  }
});

describe('.isApiError', () => {
  it('returns true with SparkpostApiError', () => {
    const data = {
      exception: {
        values: [{
          type: 'SparkpostApiError'
        }]
      }
    };

    expect(isApiError(data)).toEqual(true);
  });

  it('returns true with ZuoraApiError', () => {
    const data = {
      exception: {
        values: [{
          type: 'ZuoraApiError'
        }]
      }
    };

    expect(isApiError(data)).toEqual(true);
  });

  it('returns false with TypeError', () => {
    const data = {
      exception: {
        values: [{
          type: 'TypeError'
        }]
      }
    };

    expect(isApiError(data)).toEqual(false);
  });
});

describe('.isChunkFailure', () => {
  it('returns true with a chunk loading error', () => {
    const data = {
      exception: {
        values: [{
          value: 'Loading chunk 5 failed.'
        }]
      }
    };

    expect(isChunkFailure(data)).toEqual(true);
  });

  it('returns false with another error', () => {
    const data = {
      exception: {
        values: [{
          value: 'Network Error'
        }]
      }
    };

    expect(isChunkFailure(data)).toEqual(false);
  });
});

describe('.isErrorFromOurBundle', () => {
  it('returns true with error from our bundle', () => {
    const data = {
      exception: {
        values: [{
          stacktrace: {
            frames: [
              { filename: 'https://app.sparkpost.com/static/js/bundle.js', function: 'render' }
            ]
          }
        }]
      }
    };

    expect(isErrorFromOurBundle(data)).toEqual(true);
  });

  it('returns true with error from our bundle when running locally', () => {
    const data = {
      exception: {
        values: [{
          stacktrace: {
            frames: [
              { filename: 'http://app.sparkpost.test/4.a0803f8355f692de1382.hot-update.js', function: 'render' }
            ]
          }
        }]
      }
    };

    expect(isErrorFromOurBundle(data)).toEqual(true);
  });

  it('returns true with error from a native function called from our bundle', () => {
    const data = {
      exception: {
        values: [{
          stacktrace: {
            frames: [
              { filename: 'https://app.sparkpost.com/static/js/bundle.js', function: 'render' },
              { filename: '<anonymous>', function: 'Object.stringify' }
            ]
          }
        }]
      }
    };

    expect(isErrorFromOurBundle(data)).toEqual(true);
  });

  it('returns false with error from other source', () => {
    const data = {
      exception: {
        values: [{
          stacktrace: {
            frames: [
              { filename: 'chrome-extension://klkagjiegnnaknmfkmkbnjpmifplpiak/bull.js', function: 'steal' }
            ]
          }
        }]
      }
    };

    expect(isErrorFromOurBundle(data)).toEqual(false);
  });

  it('ignores raven-js frames and returns false with error from other source', () => {
    const data = {
      exception: {
        values: [{
          stacktrace: {
            frames: [
              { filename: 'https://app.sparkpost.com/static/js/bundle.js', function: 'HTMLDocument.wrapped' },
              { filename: 'chrome-extension://klkagjiegnnaknmfkmkbnjpmifplpiak/bull.js', function: 'steal' }
            ]
          }
        }]
      }
    };

    expect(isErrorFromOurBundle(data)).toEqual(false);
  });

  it('returns false with exceptionless error', () => {
    const data = {
      exception: {
        values: []
      }
    };

    expect(isErrorFromOurBundle(data)).toEqual(false);
  });
});

describe('.install', () => {
  let config;
  let install;
  const store = jest.fn();

  beforeEach(() => {
    config = jest.spyOn(mockRaven, 'config').mockReturnThis();
    install = jest.spyOn(mockRaven, 'install');
  });

  afterEach(() => {
    config.mockRestore();
    install.mockRestore();
  });

  it('does nothing when not configured', () => {
    ErrorTracker.install({}, store);
    expect(config).not.toHaveBeenCalled();
  });

  it('installs error tracking service with configuration', () => {
    ErrorTracker.install({ sentry: {}}, store);
    expect(config).toHaveBeenCalled();
  });
});

describe('.report', () => {
  let captureException;
  let isSetup;
  const error = new Error('Oh no!');

  beforeEach(() => {
    captureException = jest.spyOn(mockRaven, 'captureException');
    isSetup = jest.spyOn(mockRaven, 'isSetup');
  });

  afterEach(() => {
    captureException.mockRestore();
    isSetup.mockRestore();
  });

  it('does nothing when not setup', () => {
    isSetup.mockReturnValue(false);
    ErrorTracker.report('test-logger', error);
    expect(captureException).not.toHaveBeenCalled();
  });

  it('sends error when setup', () => {
    isSetup.mockReturnValue(true);
    ErrorTracker.report('test-logger', error);
    expect(captureException).toHaveBeenCalledWith(error, { logger: 'test-logger', extra: {}});
  });

  it('sends extra data', () => {
    ErrorTracker.report('test-logger', error, { foo: 'bar' });
    expect(captureException).toHaveBeenCalledWith(error, { logger: 'test-logger', extra: { foo: 'bar' }});
  });
});
