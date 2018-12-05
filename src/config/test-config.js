const testConfig = {
  apiBase: 'http://fake-api-test-host.com',
  defaultPlan: 'free500-1018',
  splashPage: '/dashboard',
  smtpAuth: {
    host: 'smtp.sparkmail.com',
    alternativePort: 2525
  },
  support: {
    algolia: {
      appID: 'id',
      apiKey: 'key',
      index: 'index'
    }
  },
  authentication: {
    app: {
      cookie: {
        name: 'test',
        options: {
          path: '/'
        }
      }
    },
    site: {
      cookie: {
        name: 'website_test',
        options: {
          path: '/'
        }
      }
    }
  },
  cookieConsent: {
    cookie: {
      name: 'cookieConsent',
      ageDays: 365,
      options: {
        domain: 'test',
        path: '/'
      }
    }
  }
};

export default testConfig;
