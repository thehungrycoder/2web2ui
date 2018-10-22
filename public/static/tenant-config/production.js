window.SP = window.SP || {};
window.SP.productionConfig = {
  apiBase: 'http://api.sparkpost.test/api',
  authentication: {
    site: {
      cookie: {
        options: {
          domain: '.sparkpost.test'
        }
      }
    }
  },
  cookieConsent: {
    cookie: {
      options: {
        domain: 'sparkpost.test'
      }
    }
  },
  featureFlags: {
    allow_default_signing_domains_for_ip_pools: false,
    allow_mailbox_verification: true,
    allow_anyone_at_verification: true,
    has_signup: true
  },
  gaTag: 'UA-111136819-2',
  gtmId: 'GTM-P87NNJ4',
  labsBase: 'http://api.sparkpost.test/api/labs',
  sentry: {
    projectId: 232588,
    publicKey: '63149b1565df4b7199db939a4410b47a'
  },
  siftScience: {
    id: '88affa8e11'
  },
  splashPage: '/dashboard',
  smtpAuth: {
    host: 'smtp.sparkmail.com',
    alternativePort: 2525
  },
  support: {
    algolia: {
      appID: 'SFXAWCYDV8',
      apiKey: '9ba87280f36f539fcc0a318c2d4fcfe6',
      index: 'development_site_posts_support_article'
    }
  },
  website: {
    domain: 'sparkpost.test'
  }
};
