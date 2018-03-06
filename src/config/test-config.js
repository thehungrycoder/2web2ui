const testConfig = {
  apiBase: 'http://fake-api-test-host.com',
  splashPage: '/dashboard',
  smtpAuth: {
    host: 'smtp.sparkmail.com',
    alternativePort: 2525
  },
  authentication: {
    cookie: {
      name: 'test',
      options: {
        path: '/'
      }
    }
  },
  website: {
    domain1: 'sparkpost.test'
  }
};

export default testConfig;
