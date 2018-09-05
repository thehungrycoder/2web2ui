/**
 * This is a list of all staging tenants and their specific configurations
 * @example
 *   {
 *     // the unique tenant id
 *     myTenant: {
 *
 *       // an alternative identifier for tenantId
 *       alias: 'meTenant',
 *
 *       // all other values are overrides for the default template
 *     }
 *   }
 */
const stagingTenants = {
  stagingmtas: {
    apiBase: '//api-staging-mtas.sparkpost.com/api/v1',
    featureFlags: {
      allow_anyone_at_verification: true
    },
    host: 'app-staging-mtas.sparkpost.com',
    smtpAuth: {
      host: 'smtp-staging-mtas.sparkpostmail.com',
      username: 'stagingmtas',
      alternativePort: 2525
    },
    trackingDomains: {
      cnameValue: 'stage-mtas.spgo.io'
    }
  },
  stagingmtas2: {
    apiBase: '//api-staging-mtas2.sparkpost.com/api/v1',
    bounceDomains: {
      cnameValue: 'staging-mtas2.mail.e.sparkpost.com'
    },
    featureFlags: {
      allow_anyone_at_verification: true
    },
    host: 'app-staging-mtas2.sparkpost.com',
    smtpAuth: {
      host: 'smtp-staging-mtas2.sparkpostmail.com',
      username: 'staging-mtas2',
      alternativePort: 2525
    },
    trackingDomains: {
      cnameValue: 'staging-mtas2.spgo.io'
    }
  },
  staging: {
    apiBase: '//api-staging.sparkpost.com/api/v1',
    crossLinkTenant: 'spc',
    gtmId: 'GTM-5BCG3R',
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true,
      has_signup: true
    },
    host: 'app-staging.sparkpost.com',
    siftScience: {
      id: '88affa8e11'
    },
    smtpAuth: {
      host: 'smtp-staging.sparkpostmail.com',
      username: 'SMTP_Injection',
      alternativePort: 2525
    },
    splashPage: '/dashboard',
    trackingDomains: {
      cnameValue: 'stage.spgo.io'
    }
  },
  stagingmtaspc: {
    apiBase: '//api-stagingmtaspc.sparkpost.com/api/v1',
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true,
      has_signup: true
    },
    host: 'app-stagingmtaspc.sparkpost.com',
    siftScience: {
      accountPrefix: 'stagingmtaspc-',
      id: '88affa8e11'
    },
    smtpAuth: {
      username: 'stagingmtaspc',
      alternativePort: 2525
    },
    splashPage: '/dashboard'
  },
  balutest: {
    bounceDomains: {
      allowDefault: false
    }
  },
  spestaging: {
    smtpAuth: {
      host: 'smtp-spestaging42.msyscloud.com'
    },
    trackingDomains: {
      cnameValue: 'click.spestaging42.msyscloud.com'
    }
  }
};

module.exports = stagingTenants;
