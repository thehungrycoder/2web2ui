const config = {
  apiBase: 'no-default-set',
  apiDateFormat: 'YYYY-MM-DDTHH:mm',
  apiRequestTimeout: 30000,
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
  chartColors: ['#04AEF9', '#fa6423', '#FFD300', '#8CCA3A', '#b94696'],
  contact: {
    abuseEmail: 'compliance@sparkpost.com',
    contactEmail: 'hello@sparkpost.com',
    supportEmail: 'support@sparkpost.com',
    billingEmail: 'billing@sparkpost.com'
  },
  featureFlags: {
    allow_mailbox_verification: true,
    allow_anyone_at_verification: false,
    has_signup: false
  },
  gaTag: 'no-default-set',
  maxUploadSizeBytes: 20000000,
  metricsPrecisionMap: [
    { time: 60, value: '1min', format: 'ha' },
    { time: 60 * 2, value: '5min', format: 'ha' },
    { time: 60 * 4, value: '15min', format: 'ha' },
    { time: 60 * 24 * 2, value: 'hour', format: 'ha' },
    { time: 60 * 24 * 7, value: 'day', format: 'MMM Do' },
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
    pricePerIp: 20.00,
    awsPricePerIp: 0.028
  },
  sentry: {
    projectId: 232588,
    publicKey: '63149b1565df4b7199db939a4410b47a'
  },
  splashPage: '/reports/summary',
  summaryChart: {
    defaultMetrics: ['count_targeted', 'count_rendered', 'count_accepted', 'count_bounce']
  },
  support: {
    maxAttachmentSizeBytes: 1000 * 1000
  },
  templates: {
    testData: {
      substitution_data: {},
      metadata: {},
      options: {}
    }
  },
  tenant: 'local',
  zuora: {
    baseUrl: 'https://rest.apisandbox.zuora.com/v1',
    timeout: 15000
  },
  smtpAuth: {
    host: 'no-default-set',
    port: 587,
    username: 'SMTP_Injection'
  },
  sso: {
    enabled: false
  },
  bounceDomains: {
    allowDefault: true,
    cnameValue: 'sparkpostmail.com'
  },
  trackingDomains: {
    cnameValue: 'spgo.io'
  },
  dateFormat: 'MMM D YYYY',
  timeFormat: 'h:mma',
  messageEvents: {
    retentionPeriodDays: 10
  },
  recaptcha: {
    key: '6LeFZQETAAAAACWJfxw_DKHgEPnop3brlj9IsHrY',
    invisibleKey: '6LekChoUAAAAAJZouMPHnhRss2t7-ZetbAABfsOZ'
  },
  attribution: {
    cookieName: 'attribution',
    cookieDuration: 60 * 24 * 30,
    cookieDomain: '.sparkpost.com'
  },
  salesforceDataParams: ['sfdcid', 'src', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']
};

export default config;
