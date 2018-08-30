/**
 * This is a complete list of all tenants and their specific configurations
 * @example
 *   {
 *     // the unique tenant id
 *     myTenant: {
 *
 *       // a base configuration
 *       context: 'production',
 *
 *       // an alternative identifier for tenantId
 *       alias: 'meTenant',
 *
 *       // all other values are overrides for the default template
 *     }
 *   }
 */
const tenants = {
  '247sports': {
    context: 'production',
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true
    },
    trackingDomains: {
      cnameValue: 'track.247sports-m.msyscloud.com'
    }
  },
  amex: {
    context: 'production',
    alias: 'amexgbt',
    bounceDomains: {
      allowDefault: false
    },
    trackingDomains: {
      cnameValue: 'track.amexgbt-m.sparkpostelite.com'
    }
  },
  mtaspc: {
    context: 'uat',
    apiBase: '//api-mtaspc.tst.sparkpost.com/api/v1',
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
    context: 'uat',
    apiBase: '//api-speuat.tst.sparkpost.com/api/v1',
    host: 'app-speuat.tst.sparkpost.com',
    smtpAuth: {
      host: 'speuat.smtp.tst.sparkpost.com'
    },
    trackingDomains: {
      cnameValue: 'speuat.et.tst.sparkpost.com'
    }
  },
  stagingmtas: {
    context: 'staging',
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
    context: 'staging',
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
    context: 'staging',
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
    context: 'staging',
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
  uat: {
    context: 'uat',
    apiBase: '//api-uat.tst.sparkpost.com/api/v1',
    bounceDomains: {
      cnameValue: 'uat-public.mail.e.sparkpost.com',
    },
    crossLinkTenant: 'spceu',
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true,
      has_signup: true
    },
    gtmId: 'GTM-P87NNJ4',
    host: 'app-uat.tst.sparkpost.com',
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
    context: 'uat',
    apiBase: '//api-uat2.tst.sparkpost.com/api/v1',
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
    context: 'uat',
    apiBase: '//api-uat3.tst.sparkpost.com/api/v1',
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
    context: 'uat',
    apiBase: '//api-uat4.tst.sparkpost.com/api/v1',
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
  },
  spceu: {
    context: 'production',
    apiBase: '//api.eu.sparkpost.com/api/v1',
    bounceDomains: {
      allowSubaccountDefault: false,
      cnameValue: 'eu.sparkpostmail.com'
    },
    crossLinkTenant: 'spc',
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true,
      has_signup: true
    },
    gtmId: 'GTM-WN7C84',
    host: 'app.eu.sparkpost.com',
    siftScience: {
      accountPrefix: 'spceu-',
      id: '7c5f68d795'
    },
    smtpAuth: {
      host: 'smtp.eu.sparkpostmail.com',
      username: 'SMTP_Injection',
      alternativePort: 2525
    },
    splashPage: '/dashboard',
    trackingDomains: {
      cnameValue: 'eu.spgo.io'
    },
    zuora: {
      baseUrl: 'https://api.zuora.com/rest/v1'
    }
  },
  spc: {
    context: 'production',
    apiBase: '//api.sparkpost.com/api/v1',
    bounceDomains: {
      cnameValue: 'sparkpostmail.com',
    },
    crossLinkTenant: 'spceu',
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true,
      has_signup: true
    },
    gtmId: 'GTM-WN7C84',
    host: 'app.sparkpost.com',
    siftScience: {
      id: '7c5f68d795'
    },
    smtpAuth: {
      host: 'smtp.sparkpostmail.com',
      username: 'SMTP_Injection',
      alternativePort: 2525
    },
    splashPage: '/dashboard',
    trackingDomains: {
      cnameValue: 'spgo.io'
    },
    zuora: {
      baseUrl: 'https://api.zuora.com/rest/v1'
    }
  },
  atlassianeu: {
    context: 'production',
    alias: 'atlassian-eu',
    bounceDomains: {
      allowSubaccountDefault: false
    },
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true
    }
  },
  atlassianus: {
    context: 'production',
    alias: 'atlassian',
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true
    }
  },
  balutest: {
    context: 'staging',
    bounceDomains: {
      allowDefault: false
    }
  },
  becordial: {
    context: 'production',
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true
    }
  },
  booking: {
    context: 'production',
    bounceDomains: {
      allowSubaccountDefault: false
    },
    featureFlags: {
      allow_anyone_at_verification: true
    }
  },
  creditag: {
    context: 'production',
    alias: 'ca',
    bounceDomains: {
      allowSubaccountDefault: false
    }
  },
  capone: {
    context: 'production',
    alias: 'capitalone',
    featureFlags: {
      allow_anyone_at_verification: true
    },
    trackingDomains: {
      cnameValue: 'click.c1-t.msyscloud.com'
    }
  },
  careerb: {
    context: 'production',
    alias: 'careerbuilder',
    featureFlags: {
      allow_anyone_at_verification: true
    },
    trackingDomains: {
      cnameValue: 'click.sites.careerbuilder.com'
    }
  },
  cerner: {
    context: 'production',
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true
    },
    trackingDomains: {
      cnameValue: 'click.mail.cerner.com'
    }
  },
  clipper: {
    context: 'production',
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true
    },
    trackingDomains: {
      cnameValue: 'track.clipper.sparkpostelite.com'
    }
  },
  caponeuk: {
    context: 'production',
    alias: 'coep',
    bounceDomains: {
      allowSubaccountDefault: false
    },
    featureFlags: {
      allow_anyone_at_verification: true
    },
    trackingDomains: {
      cnameValue: 'click.notification.capitalone.co.uk'
    }
  },
  cordial: {
    context: 'production',
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true
    },
    trackingDomains: {
      cnameValue: 'track.sp.crdl.io'
    }
  },
  coursera: {
    context: 'production',
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true
    },
    trackingDomains: {
      cnameValue: 'click.mail.coursera.org'
    }
  },
  creator: {
    context: 'production',
    bounceDomains: {
      allowSubaccountDefault: false
    },
    featureFlags: {
      allow_anyone_at_verification: true
    }
  },
  dalenys: {
    context: 'production',
    bounceDomains: {
      allowSubaccountDefault: false
    },
    featureFlags: {
      allow_anyone_at_verification: true
    }
  },
  demo: {
    context: 'production',
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true
    },
    trackingDomains: {
      cnameValue: 'track.demo-t.sparkpostelite.com'
    }
  },
  dhi: {
    context: 'production',
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true
    }
  },
  ebates: {
    context: 'production',
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true
    },
    trackingDomains: {
      cnameValue: 'link.ebates.com'
    }
  },
  eonian: {
    context: 'production',
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true
    },
    trackingDomains: {
      cnameValue: 'link.eleatech.io'
    }
  },
  fintimes: {
    context: 'production',
    alias: 'ft',
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true
    },
    trackingDomains: {
      cnameValue: 'track-ft.sparkpostelite.com'
    }
  },
  gilt: {
    context: 'production',
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true
    },
    trackingDomains: {
      cnameValue: 'track.p.gilt.com'
    }
  },
  gmc: {
    context: 'production',
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true
    },
    trackingDomains: {
      cnameValue: 'click.gmc.sparkpostelite.com'
    }
  },
  guardian: {
    context: 'production',
    featureFlags: {
      allow_anyone_at_verification: true
    },
    trackingDomains: {
      cnameValue: 'click.notifications.glic.com'
    }
  },
  hubspot: {
    context: 'production',
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true
    }
  },
  hubspoteast: {
    context: 'production',
    trackingDomains: {
      cnameValue: 'track.hubspoteast.sparkpostelite.com'
    }
  },
  icims: {
    context: 'production',
    bounceDomains: {
      allowSubaccountDefault: false
    },
    featureFlags: {
      allow_anyone_at_verification: true
    }
  },
  ims: {
    context: 'production',
    alias: 'imshealth',
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true
    },
    trackingDomains: {
      cnameValue: 'click.sp.appature.com'
    }
  },
  intercom: {
    context: 'production',
    featureFlags: {
      allow_anyone_at_verification: true
    },
    trackingDomains: {
      cnameValue: 'track.intercom-t.sparkpostelite.com'
    }
  },
  jane: {
    context: 'production',
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true
    },
    trackingDomains: {
      cnameValue: 'click.m.jane.com'
    }
  },
  kayak: {
    context: 'production',
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true
    },
    trackingDomains: {
      cnameValue: 'track-kayak.sparkpostelite.com'
    }
  },
  linkedin: {
    context: 'production',
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true
    },
    trackingDomains: {
      cnameValue: 'track.linkedin.sparkpostelite.com'
    }
  },
  massdrop: {
    context: 'production',
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true
    },
    trackingDomains: {
      cnameValue: 't.massdrop.com'
    }
  },
  mtas4tenant: {
    context: 'production',
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true
    },
    smtpAuth: {
      alternativePort: 2525
    }
  },
  nyl: {
    context: 'production',
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true
    }
  },
  nyt: {
    context: 'production',
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true
    }
  },
  ometria: {
    context: 'production',
    bounceDomains: {
      allowSubaccountDefault: false
    },
    featureFlags: {
      allow_anyone_at_verification: true
    },
    trackingDomains: {
      cnameValue: 'click.spe.ometria.email'
    }
  },
  pinterest: {
    context: 'production',
    featureFlags: {
      allow_anyone_at_verification: true
    },
    trackingDomains: {
      cnameValue: 'post.pinterest.com'
    }
  },
  productionmtas: {
    context: 'production',
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true
    },
    smtpAuth: {
      alternativePort: 2525
    }
  },
  productionmtas2: {
    context: 'production',
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true
    },
    smtpAuth: {
      alternativePort: 2525
    }
  },
  sas: {
    context: 'production',
    bounceDomains: {
      allowDefault: false,
      allowSubaccountDefault: false
    },
    trackingDomains: {
      cnameValue: 'track.sp.ci360.sas.com'
    }
  },
  schoolm: {
    context: 'production',
    featureFlags: {
      allow_anyone_at_verification: true
    },
    trackingDomains: {
      cnameValue: 'track.spe.schoolmessenger.com'
    }
  },
  selective: {
    context: 'production',
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true
    }
  },
  sitecoreeu: {
    context: 'production',
    alias: 'sitecore-eu',
    bounceDomains: {
      allowSubaccountDefault: false
    },
    featureFlags: {
      allow_anyone_at_verification: true
    }
  },
  sitecore: {
    context: 'production',
    featureFlags: {
      allow_anyone_at_verification: true
    },
    trackingDomains: {
      cnameValue: 'click.sitecoremail.com'
    }
  },
  snagajob: {
    context: 'production',
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true
    },
    trackingDomains: {
      cnameValue: 'click.email.snagajob.com'
    }
  },
  spestaging: {
    context: 'staging',
    smtpAuth: {
      host: 'smtp-spestaging42.msyscloud.com'
    },
    trackingDomains: {
      cnameValue: 'click.spestaging42.msyscloud.com'
    }
  },
  streetauth: {
    context: 'production',
    alias: 'streetauthority',
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true
    },
    trackingDomains: {
      cnameValue: 'click.mail1.researchsend.com'
    }
  },
  surveymonkey: {
    context: 'production',
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true
    },
    trackingDomains: {
      cnameValue: 'click.outbound.surveymonkey.com'
    }
  },
  talktalk: {
    context: 'production',
    bounceDomains: {
      allowSubaccountDefault: false
    },
    featureFlags: {
      allow_anyone_at_verification: true
    },
    trackingDomains: {
      cnameValue: 'click.talktalk.co.uk'
    }
  },
  tobi: {
    context: 'production',
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true
    },
    trackingDomains: {
      cnameValue: 'tracking.mail.tobi.com'
    }
  },
  trulia: {
    context: 'production',
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true
    },
    trackingDomains: {
      cnameValue: 'click.prop.trulia.com'
    }
  },
  uber: {
    context: 'production',
    featureFlags: {
      allow_anyone_at_verification: true
    },
    trackingDomains: {
      cnameValue: 'click.uber.com'
    }
  },
  unear: {
    context: 'production',
    featureFlags: {
      allow_anyone_at_verification: true
    },
    trackingDomains: {
      cnameValue: 'track.unear.sparkpostelite.com'
    }
  },
  utilitywhouse: {
    context: 'production',
    bounceDomains: {
      allowSubaccountDefault: false
    },
    featureFlags: {
      allow_anyone_at_verification: true
    },
    trackingDomains: {
      cnameValue: 'click.utilitywarehouse.co.uk'
    }
  },
  vente: {
    context: 'production',
    alias: 'vente-exclusive',
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true
    },
    trackingDomains: {
      cnameValue: 'click1.mail1.vente-exclusive.com'
    }
  },
  vivastreet: {
    context: 'production',
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true
    },
    trackingDomains: {
      cnameValue: 'click.sitemail.vivastreet.com'
    }
  },
  vivmail: {
    context: 'production',
    bounceDomains: {
      allowSubaccountDefault: false
    },
    featureFlags: {
      allow_anyone_at_verification: true
    }
  },
  wawd: {
    context: 'production',
    featureFlags: {
      allow_anyone_at_verification: true
    },
    trackingDomains: {
      cnameValue: 'track.sp.actionkit.com'
    }
  },
  wcare: {
    context: 'production',
    featureFlags: {
      allow_anyone_at_verification: true
    },
    trackingDomains: {
      cnameValue: 'track.wcare-m.sparkpostelite.com'
    }
  },
  workday: {
    context: 'production',
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true
    },
    trackingDomains: {
      cnameValue: 'track.workdayconnect.com'
    }
  },
  zillow: {
    context: 'production',
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true
    },
    trackingDomains: {
      cnameValue: 'click.mail.zillow.com'
    }
  },
  ziprealty: {
    context: 'production',
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true
    }
  },
  zip: {
    context: 'production',
    alias: 'ziprecruiter',
    featureFlags: {
      allow_anyone_at_verification: true
    },
    trackingDomains: {
      cnameValue: 'track.sparkpost.ziprecruiter.com'
    }
  },
  zynga: {
    context: 'production',
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true
    },
    trackingDomains: {
      cnameValue: 'track.spe.zyngamail.com'
    }
  }
};

module.exports = tenants;
