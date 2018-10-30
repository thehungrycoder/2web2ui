/**
 * This is a list of all uat tenants and their specific configurations
 * @example
 *   {
 *     // the unique tenant id
 *     myTenant: {
 *
 *       // an alternative identifier for tenantId
 *       alias: 'meTenant',
 *
 *       // host to "next" deployment
 *       nextHost: 'next.tst.sparkpost.com'
 *
 *       // host to back door
 *       originHost: 'origin.tst.sparkpost.com'
 *
 *       // all other values are overrides for the default template
 *     }
 *   }
 */
const uatTenants = {
  mtaspc: {
    apiBase: 'https://api-mtaspc.tst.sparkpost.com/api',
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true,
      has_signup: true
    },
    host: 'app-mtaspc.tst.sparkpost.com',
    siftScience: {
      accountPrefix: 'mtaspc-',
      id: '88affa8e11'
    },
    smtpAuth: {
      host: 'mtaspc.smtp.e.tst.sparkpost.com',
      alternativePort: 2525
    },
    splashPage: '/dashboard',
    trackingDomains: {
      cnameValue: 'mtaspc.et.e.tst.sparkpost.com'
    }
  },
  speuat: {
    apiBase: 'https://api-speuat.tst.sparkpost.com/api',
    host: 'app-speuat.tst.sparkpost.com',
    smtpAuth: {
      host: 'speuat.smtp.tst.sparkpost.com'
    },
    trackingDomains: {
      cnameValue: 'speuat.et.tst.sparkpost.com'
    }
  },
  uat: {
    apiBase: 'https://api-uat.tst.sparkpost.com/api',
    bounceDomains: {
      cnameValue: 'uat-public.mail.e.sparkpost.com'
    },
    crossLinkTenant: 'spceu',
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true,
      has_signup: true
    },
    gtmId: 'GTM-P87NNJ4',
    host: 'app-uat.tst.sparkpost.com',
    nextHost: 'phoenix-next.tst.sparkpost.com',
    originHost: 'phoenix-origin.tst.sparkpost.com',
    siftScience: {
      id: '88affa8e11'
    },
    smtpAuth: {
      host: 'smtp.tst.sparkpost',
      username: 'SMTP_Injection'
    },
    splashPage: '/dashboard',
    trackingDomains: {
      cnameValue: 'spcuat.et.e.tst.sparkpost.com'
    }
  },
  uat2: {
    apiBase: 'https://api-uat2.tst.sparkpost.com/api',
    bounceDomains: {
      cnameValue: 'uat2public.mail.e.sparkpost.com'
    },
    featureFlags: {
      allow_anyone_at_verification: true
    },
    host: 'app-uat2.tst.sparkpost.com',
    smtpAuth: {
      host: 'smtp2.tst.sparkpost',
      username: 'uat2public'
    },
    trackingDomains: {
      cnameValue: 'uat2.spgo.io'
    }
  },
  uat3: {
    apiBase: 'https://api-uat3.tst.sparkpost.com/api',
    featureFlags: {
      allow_anyone_at_verification: true
    },
    host: 'app-uat3.tst.sparkpost.com',
    smtpAuth: {
      host: 'smtp3.tst.sparkpost'
    },
    trackingDomains: {
      cnameValue: 'uat3.spgo.io'
    }
  },
  uat4: {
    apiBase: 'https://api-uat4.tst.sparkpost.com/api',
    featureFlags: {
      allow_anyone_at_verification: true
    },
    host: 'app-uat4.tst.sparkpost.com',
    smtpAuth: {
      host: 'uat4.smtp.tst.sparkpost.com'
    },
    trackingDomains: {
      cnameValue: 'uat4.spgo.io'
    }
  }
};

module.exports = uatTenants;
