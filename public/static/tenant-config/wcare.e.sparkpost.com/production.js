window.SP = window.SP || {};
window.SP.productionConfig = {
  apiBase: '//wcare.api.e.sparkpost.com/api/v1',
  featureFlags: {
    "allow_anyone_at_verification": true, 
    "allow_mailbox_verification": true
},
  support: {"algolia": {"index": "production_site_posts_support_article", "apiKey": "9ba87280f36f539fcc0a318c2d4fcfe6", "appID": "SFXAWCYDV8"}, "enabled": true},
  gaTag: 'UA-111136819-2',
  sentry: {
    projectId: 237613,
    publicKey: '014f9707c27b4e7ea90aff051a82e561'
  },
  smtpAuth: {
    enabled: true,
    host: 'wcare.smtp.e.sparkpost.com',
    port: 587,
    username: "wcare",
    commaFixer: "fixer of the trailing commas"
  },
  trackingDomains: {
    cnameValue: 'track.wcare-m.sparkpostelite.com'
  },
  bounceDomains: {
    allowDefault: true,
    allowSubaccountDefault: true,
    cnameValue: 'wcare.mail.e.sparkpost.com'
  },
  tenant: 'wcare'
};
