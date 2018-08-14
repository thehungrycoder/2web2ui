window.SP = window.SP || {};
window.SP.productionConfig = {
  apiBase: '//sas.api.e.sparkpost.com/api/v1',
  featureFlags: {},
  support: {"algolia": {"index": "production_site_posts_support_article", "apiKey": "9ba87280f36f539fcc0a318c2d4fcfe6", "appID": "SFXAWCYDV8"}, "enabled": true},
  sentry: {
    projectId: 237613,
    publicKey: '014f9707c27b4e7ea90aff051a82e561'
  },
  smtpAuth: {
    enabled: true,
    host: 'sas.smtp.e.sparkpost.com',
    port: 587,
    username: "sas",
    commaFixer: "fixer of the trailing commas"
  },
  trackingDomains: {
    cnameValue: 'track.sp.ci360.sas.com'
  },
  bounceDomains: {
    allowDefault: false,
    allowSubaccountDefault: false,
    cnameValue: 'sas.mail.e.sparkpost.com'
  },
  tenant: 'sas'
};
