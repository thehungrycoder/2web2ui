window.SP = window.SP || {};
window.SP.productionConfig = {
  apiBase: '//spestaging.api.e.sparkpost.com/api/v1',
  featureFlags: {},
  support: {"algolia": {"index": "staging_site_posts_support_article", "apiKey": "9ba87280f36f539fcc0a318c2d4fcfe6", "appID": "SFXAWCYDV8"}, "enabled": true},
  gaTag: 'UA-111136819-2',
  sentry: {
    projectId: 237612,
    publicKey: 'cb27762b225f4884b5e035580f1cc289'
  },
  smtpAuth: {
    enabled: true,
    host: 'smtp-spestaging42.msyscloud.com',
    port: 587,
    username: "spestaging",
    commaFixer: "fixer of the trailing commas"
  },
  trackingDomains: {
    cnameValue: 'click.spestaging42.msyscloud.com'
  },
  bounceDomains: {
    allowDefault: true,
    allowSubaccountDefault: true,
    cnameValue: 'spestaging.mail.e.sparkpost.com'
  },
  tenant: 'spestaging'
};
