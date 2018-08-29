window.SP = window.SP || {};
window.SP.productionConfig = {
  apiBase: '//api-staging-mtas.sparkpost.com/api/v1',
  featureFlags: {
    "allow_anyone_at_verification": true, 
    "allow_mailbox_verification": true
},
  support: {"algolia": {"index": "staging_site_posts_support_article", "apiKey": "9ba87280f36f539fcc0a318c2d4fcfe6", "appID": "SFXAWCYDV8"}, "enabled": true},
  gaTag: 'UA-111136819-2',
  sentry: {
    projectId: 237612,
    publicKey: 'cb27762b225f4884b5e035580f1cc289'
  },
  smtpAuth: {
    enabled: true,
    host: 'smtp-staging-mtas.sparkpostmail.com',
    port: 587,
    username: "stagingmtas",
    alternativePort: 2525,
    commaFixer: "fixer of the trailing commas"
  },
  trackingDomains: {
    cnameValue: 'stage-mtas.spgo.io'
  },
  bounceDomains: {
    allowDefault: true,
    allowSubaccountDefault: true,
    cnameValue: 'stagingmtas.mail.e.sparkpost.com'
  },
  tenant: 'stagingmtas'
};
