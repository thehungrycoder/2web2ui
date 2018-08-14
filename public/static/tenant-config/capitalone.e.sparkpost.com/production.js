window.SP = window.SP || {};
window.SP.productionConfig = {
  apiBase: '//capitalone.api.e.sparkpost.com/api/v1',
  featureFlags: {},
  support: {"algolia": {"index": "production_site_posts_support_article", "apiKey": "9ba87280f36f539fcc0a318c2d4fcfe6", "appID": "SFXAWCYDV8"}, "enabled": true},
  gaTag: 'UA-111136819-2',
  sentry: {
    projectId: 237613,
    publicKey: '014f9707c27b4e7ea90aff051a82e561'
  },
  smtpAuth: {
    enabled: true,
    host: 'capitalone.smtp.e.sparkpost.com',
    port: 587,
    username: "capitalone",
    commaFixer: "fixer of the trailing commas"
  },
  trackingDomains: {
    cnameValue: 'click.c1-t.msyscloud.com'
  },
  bounceDomains: {
    allowDefault: true,
    allowSubaccountDefault: true,
    cnameValue: 'capitalone.mail.e.sparkpost.com'
  },
  tenant: 'capone'
};
