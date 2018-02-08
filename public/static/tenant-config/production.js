window.SP = window.SP || {};
window.SP.productionConfig = {
  apiBase: 'http://api.sparkpost.test/api/v1',
  featureFlags: {
    allow_mailbox_verification: true,
    allow_anyone_at_verification: true
  },
  gaTag: 'UA-111136819-2',
  splashPage: '/dashboard',
  smtpAuth: {
    host: 'smtp.sparkmail.com',
    alternativePort: 2525
  }
};
