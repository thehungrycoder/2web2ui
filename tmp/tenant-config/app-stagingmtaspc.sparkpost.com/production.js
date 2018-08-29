window.SP = window.SP || {};
window.SP.productionConfig = {
  apiBase: '//api-stagingmtaspc.sparkpost.com/api/v1',
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
  support: {"algolia": {"index": "staging_site_posts_support_article", "apiKey": "9ba87280f36f539fcc0a318c2d4fcfe6", "appID": "SFXAWCYDV8"}, "enabled": true},
  zuora: {
    baseUrl: 'https://rest.apisandbox.zuora.com/v1',
  },
  gaTag: 'UA-111136819-2',
  sentry: {
    projectId: 237612,
    publicKey: 'cb27762b225f4884b5e035580f1cc289'
  },
  siftScience: {
    accountPrefix: 'stagingmtaspc-',
    id: '88affa8e11'
  },
  smtpAuth: {
    enabled: true,
    host: 'stagingmtaspc.smtp.e.sparkpost.com',
    port: 587,
    username: "stagingmtaspc",
    alternativePort: 2525,
    commaFixer: "fixer of the trailing commas"
  },
  trackingDomains: {
    cnameValue: 'stagingmtaspc.et.e.sparkpost.com'
  },
  bounceDomains: {
    allowDefault: true,
    allowSubaccountDefault: true,
    cnameValue: 'stagingmtaspc.mail.e.sparkpost.com'
  },
  tenant: 'stagingmtaspc'
};
