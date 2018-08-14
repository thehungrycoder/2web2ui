window.SP = window.SP || {};
window.SP.productionConfig = {
  apiBase: '//api.eu.sparkpost.com/api/v1',
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
  support: {"algolia": {"index": "production_site_posts_support_article", "apiKey": "9ba87280f36f539fcc0a318c2d4fcfe6", "appID": "SFXAWCYDV8"}, "enabled": true},
  zuora: {
    baseUrl: 'https://api.zuora.com/rest/v1',
  },
  gtmId: 'GTM-WN7C84',
  sentry: {
    projectId: 237613,
    publicKey: '014f9707c27b4e7ea90aff051a82e561'
  },
  siftScience: {
    accountPrefix: 'spceu-',
    id: '7c5f68d795'
  },
  smtpAuth: {
    enabled: true,
    host: 'smtp.eu.sparkpostmail.com',
    port: 587,
    username: "SMTP_Injection",
    alternativePort: 2525,
    commaFixer: "fixer of the trailing commas"
  },
  trackingDomains: {
    cnameValue: 'eu.spgo.io'
  },
  bounceDomains: {
    allowDefault: true,
    allowSubaccountDefault: false,
    cnameValue: 'eu.sparkpostmail.com'
  },
  crossLinkTenant: 'spc',
  tenant: 'spceu'
};
