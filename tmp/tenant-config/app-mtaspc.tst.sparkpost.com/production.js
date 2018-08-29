window.SP = window.SP || {};
window.SP.productionConfig = {
  apiBase: '//api-mtaspc.tst.sparkpost.com/api/v1',
  featureFlags: {
    "allow_anyone_at_verification": true, 
    "allow_default_signing_domains_for_ip_pools": true, 
    "allow_mailbox_verification": true, 
    "has_signup": true, 
    "sending_domains_v2": true, 
    "templatesBySubaccount": true, 
    "usage_from_redis": true
},
  splashPage: '/dashboard',
  support: {"algolia": {"index": "development_site_posts_support_article", "apiKey": "9ba87280f36f539fcc0a318c2d4fcfe6", "appID": "SFXAWCYDV8"}, "enabled": true},
  zuora: {
    baseUrl: 'https://rest.apisandbox.zuora.com/v1',
  },
  gaTag: 'UA-111136819-2',
  sentry: {
    projectId: 237611,
    publicKey: 'b63907577f9c4091895c49cc963fa8e4'
  },
  siftScience: {
    accountPrefix: 'mtaspc-',
    id: '88affa8e11'
  },
  smtpAuth: {
    enabled: true,
    host: 'mtaspc.smtp.e.tst.sparkpost.com',
    port: 587,
    username: "mtaspc",
    alternativePort: 2525,
    commaFixer: "fixer of the trailing commas"
  },
  trackingDomains: {
    cnameValue: 'mtaspc.et.e.tst.sparkpost.com'
  },
  bounceDomains: {
    allowDefault: true,
    allowSubaccountDefault: true,
    cnameValue: 'mtaspc.mail.e.sparkpost.com'
  },
  tenant: 'mtaspc'
};
