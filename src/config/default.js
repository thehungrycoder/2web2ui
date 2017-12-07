const config = {
  apiBase: 'no-default-set',
  apiDateFormat: 'YYYY-MM-DDTHH:mm',
  apiRequestTimeout: 15000,
  apiRequestHeaders: {
    'X-Sparky': '1d24c3473dd52a2f4a53fb6808cf9a73'
  },
  authentication: {
    cookie: {
      name: 'auth',
      options: {
        path: '/'
      }
    },
    headers: {
      Authorization: 'Basic bXN5c1dlYlVJOmZhODZkNzJlLTYyODctNDUxMy1hZTdmLWVjOGM4ZmEwZDc2Ng==',
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  },
  cardTypes: [
    { paymentFormat: 'visa', apiFormat: 'Visa' },
    { paymentFormat: 'mastercard', apiFormat: 'MasterCard' },
    { paymentFormat: 'amex', apiFormat: 'AmericanExpress' },
    { paymentFormat: 'discover', apiFormat: 'Discover' }
  ],
  chartColors: ['#04AEF9', '#fa6423', '#FFD300', '#8CCA3A', '#2693c3'],
  contact: {
    abuseEmail: 'compliance@sparkpost.com',
    contactEmail: 'hello@sparkpost.com',
    supportEmail: 'support@sparkpost.com',
    billingEmail: 'billing@sparkpost.com'
  },
  metricsPrecisionMap: [
    { time: 60, value: '1min', format: 'ha' },
    { time: 60 * 2, value: '5min', format: 'ha' },
    { time: 60 * 4, value: '15min', format: 'ha' },
    { time: 60 * 24 * 2, value: 'hour', format: 'ha' },
    { time: 60 * 24 * 7, value: '12hr', format: 'MMM Do' },
    { time: 60 * 24 * 33, value: 'day', format: 'MMM Do' },
    { time: 60 * 24 * 190, value: 'week', format: 'MMM Do' },
    { time: Infinity, value: 'month', format: 'MMM YY' }
  ],
  release: process.env.REACT_APP_VERSION,
  sandbox: {
    localpart: 'sandbox',
    domain: 'sparkpostbox.com'
  },
  sendingIps: {
    maxPerAccount: 4,
    pricePerIp: 20.00
  },
  sentry: {
    projectId: 232588,
    publicKey: '63149b1565df4b7199db939a4410b47a'
  },
  showThingOnDash: true,
  showSummaryReport: true,
  summaryChart: {
    enabled: false,
    defaultMetrics: ['count_targeted', 'count_rendered', 'count_accepted', 'count_bounce']
  },
  templates: {
    testData: {
      substitution_data: {},
      metadata: {},
      options: {}
    }
  },
  tenant: 'local',
  touLink: 'https://www.sparkpost.com/policies/tou/',
  zuora: {
    baseUrl: 'https://rest.apisandbox.zuora.com/v1',
    timeout: 15000
  },
  sso: {
    enabled: false
  }
};

export default config;
