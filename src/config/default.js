const config = {
  apiBase: 'no-default-set',
  apiDateFormat: 'YYYY-MM-DDTHH:mm',
  apiRequestTimeout: 60000,
  apiRequestHeaders: {
    'X-Sparky': '1d24c3473dd52a2f4a53fb6808cf9a73'
  },
  apiRequestBodyMaxSizeBytes: 500 * 1000, // ~ 500 KB
  authentication: {
    app: {
      cookie: {
        name: 'auth',
        options: {
          path: '/'
        }
      },
      authHeader: 'Basic bXN5c1dlYlVJOmZhODZkNzJlLTYyODctNDUxMy1hZTdmLWVjOGM4ZmEwZDc2Ng=='
    },
    site: {
      cookie: {
        name: 'website_auth',
        options: {
          domain: '.sparkpost.com',
          path: '/'
        }
      },
      authHeader: 'Basic bXN5c1VJTGltaXRlZDphZjE0OTdkYS02NjI5LTQ3NTEtODljZS01ZDBmODE4N2MyMDQ='
    }
  },
  cardTypes: [
    { paymentFormat: 'visa', apiFormat: 'Visa' },
    { paymentFormat: 'mastercard', apiFormat: 'MasterCard' },
    { paymentFormat: 'amex', apiFormat: 'AmericanExpress' },
    { paymentFormat: 'discover', apiFormat: 'Discover' }
  ],
  chartColors: ['#04AEF9', '#fa6423', '#FFD300', '#8CCA3A', '#b94696'],
  cookieConsent: {
    cookie: {
      name: 'cookieConsent',
      ageDays: 365,
      options: {
        domain: 'sparkpost.com',
        path: '/'
      }
    }
  },
  featureFlags: {
    allow_default_signing_domains_for_ip_pools: false,
    allow_mailbox_verification: true,
    allow_anyone_at_verification: false,
    has_signup: false
  },
  heroku: {
    cookieName: 'heroku-nav-data'
  },
  maxUploadSizeBytes: 20000000,
  maxRecipVerifUploadSizeBytes: 200000000,
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
  splashPage: '/reports/summary',
  summaryChart: {
    defaultMetrics: ['count_targeted', 'count_rendered', 'count_accepted', 'count_bounce']
  },
  support: {
    maxAttachmentSizeBytes: 500 * 1000 // ~ 500 KB
  },
  templates: {
    testData: {
      substitution_data: {},
      metadata: {},
      options: {}
    }
  },
  tenant: 'local',
  website: {
    domain: 'sparkpost.com'
  },
  zuora: {
    baseUrl: 'https://rest.apisandbox.zuora.com/v1',
    timeout: 15000
  },
  brightback: {
    baseUrl: 'https://app.brightback.com',
    app_id: '9N0rWBvKGR',
    downgradeToFreeUrls: {
      save_return_url: '/account/billing', // Return URL from Brightback for end-users who do not cancel
      cancel_confirmation_url: '/account/billing/plan/change', // Return URL from Brightback for end-users who cancel
      billing_url: '/account/billing/plan' // Billing URL to direct end-users to enter coupon code or other billing changes
    },
    freePlan: 'free500-1018'
  },
  smtpAuth: {
    host: 'no-default-set',
    port: 587,
    username: 'SMTP_Injection'
  },
  bounceDomains: {
    allowDefault: true,
    allowSubaccountDefault: false,
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
  salesforceDataParams: ['src', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']
};

export default config;
