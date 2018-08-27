const _ = require('lodash');

// This is a complete list of all tenants and their specific configurations
const tenants = {
  '247sports': {
    include: 'production',
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true
    },
    trackingDomains: {
      cnameValue: 'track.247sports-m.msyscloud.com'
    }
  },
  amex: {
    include: 'production',
    alias: 'amexgbt',
    bounceDomains: {
      allowDefault: false
    },
    trackingDomains: {
      cnameValue: 'track.amexgbt-m.sparkpostelite.com'
    }
  },
  mtaspc: {
    include: 'uat',
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
    include: 'uat',
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
    include: 'staging',
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
    include: 'staging',
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
    include: 'staging',
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
    include: 'staging',
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
    include: 'uat',
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
    include: 'uat',
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
    include: 'uat',
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
    include: 'uat',
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
    include: 'production',
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
    include: 'production',
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
    include: 'production',
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
    include: 'production',
    alias: 'atlassian',
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true
    }
  },
  balutest: {
    include: 'staging',
    bounceDomains: {
      allowDefault: false
    }
  },
  becordial: {
    include: 'production',
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true
    }
  },
  booking: {
    include: 'production',
    bounceDomains: {
      allowSubaccountDefault: false
    },
    featureFlags: {
      allow_anyone_at_verification: true
    }
  },
  creditag: {
    include: 'production',
    alias: 'ca',
    bounceDomains: {
      allowSubaccountDefault: false
    }
  },
  capone: {
    include: 'production',
    alias: 'capitalone',
    trackingDomains: {
      cnameValue: 'click.c1-t.msyscloud.com'
    }
  },
  careerb: {
    include: 'production',
    alias: 'careerbuilder',
    featureFlags: {
      allow_anyone_at_verification: true
    },
    trackingDomains: {
      cnameValue: 'click.sites.careerbuilder.com'
    }
  },
  cerner: {
    include: 'production',
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true
    },
    trackingDomains: {
      cnameValue: 'click.mail.cerner.com'
    }
  },
  clipper: {
    include: 'production',
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true
    },
    trackingDomains: {
      cnameValue: 'track.clipper.sparkpostelite.com'
    }
  },
  caponeuk: {
    include: 'production',
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
    include: 'production',
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true
    },
    trackingDomains: {
      cnameValue: 'track.sp.crdl.io'
    }
  },
  coursera: {
    include: 'production',
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true
    },
    trackingDomains: {
      cnameValue: 'click.mail.coursera.org'
    }
  },
  creator: {
    include: 'production',
    bounceDomains: {
      allowSubaccountDefault: false
    },
    featureFlags: {
      allow_anyone_at_verification: true
    }
  },
  dalenys: {
    include: 'production',
    bounceDomains: {
      allowSubaccountDefault: false
    },
    featureFlags: {
      allow_anyone_at_verification: true
    }
  },
  demo: {
    include: 'production',
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true
    },
    trackingDomains: {
      cnameValue: 'track.demo-t.sparkpostelite.com'
    }
  },
  dhi: {
    include: 'production',
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true
    }
  },
  ebates: {
    include: 'production',
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true
    },
    trackingDomains: {
      cnameValue: 'link.ebates.com'
    }
  },
  eonian: {
    include: 'production',
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true
    },
    trackingDomains: {
      cnameValue: 'link.eleatech.io'
    }
  },
  fintimes: {
    include: 'production',
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
    include: 'production',
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true
    },
    trackingDomains: {
      cnameValue: 'track.p.gilt.com'
    }
  },
  gmc: {
    include: 'production',
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true
    },
    trackingDomains: {
      cnameValue: 'click.gmc.sparkpostelite.com'
    }
  },
  guardian: {
    include: 'production',
    featureFlags: {
      allow_anyone_at_verification: true
    },
    trackingDomains: {
      cnameValue: 'click.notifications.glic.com'
    }
  },
  hubspot: {
    include: 'production',
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true
    }
  },
  hubspoteast: {
    include: 'production',
    trackingDomains: {
      cnameValue: 'track.hubspoteast.sparkpostelite.com'
    }
  },
  icims: {
    include: 'production',
    bounceDomains: {
      allowSubaccountDefault: false
    },
    featureFlags: {
      allow_anyone_at_verification: true
    }
  },
  ims: {
    include: 'production',
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
    include: 'production',
    featureFlags: {
      allow_anyone_at_verification: true
    },
    trackingDomains: {
      cnameValue: 'track.intercom-t.sparkpostelite.com'
    }
  },
  jane: {
    include: 'production',
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true
    },
    trackingDomains: {
      cnameValue: 'click.m.jane.com'
    }
  },
  kayak: {
    include: 'production',
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true
    },
    trackingDomains: {
      cnameValue: 'track-kayak.sparkpostelite.com'
    }
  },
  linkedin: {
    include: 'production',
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true
    },
    trackingDomains: {
      cnameValue: 'track.linkedin.sparkpostelite.com'
    }
  },
  massdrop: {
    include: 'production',
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true
    },
    trackingDomains: {
      cnameValue: 't.massdrop.com'
    }
  },
  mtas4tenant: {
    include: 'production',
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true
    },
    smtpAuth: {
      alternativePort: 2525
    }
  },
  nyl: {
    include: 'production',
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true
    }
  },
  nyt: {
    include: 'production',
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true
    }
  },
  ometria: {
    include: 'production',
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
    include: 'production',
    featureFlags: {
      allow_anyone_at_verification: true
    },
    trackingDomains: {
      cnameValue: 'post.pinterest.com'
    }
  },
  productionmtas: {
    include: 'production',
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true
    },
    smtpAuth: {
      alternativePort: 2525
    }
  },
  productionmtas2: {
    include: 'production',
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true
    },
    smtpAuth: {
      alternativePort: 2525
    }
  },
  sas: {
    include: 'production',
    bounceDomains: {
      allowDefault: false,
      allowSubaccountDefault: false
    },
    trackingDomains: {
      cnameValue: 'track.sp.ci360.sas.com'
    }
  },
  schoolm: {
    include: 'production',
    featureFlags: {
      allow_anyone_at_verification: true
    },
    trackingDomains: {
      cnameValue: 'track.spe.schoolmessenger.com'
    }
  },
  selective: {
    include: 'production',
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true
    }
  },
  sitecoreeu: {
    include: 'production',
    alias: 'sitecore-eu',
    bounceDomains: {
      allowSubaccountDefault: false
    },
    featureFlags: {
      allow_anyone_at_verification: true
    }
  },
  sitecore: {
    include: 'production',
    featureFlags: {
      allow_anyone_at_verification: true
    },
    trackingDomains: {
      cnameValue: 'click.sitecoremail.com'
    }
  },
  snagajob: {
    include: 'production',
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true
    },
    trackingDomains: {
      cnameValue: 'click.email.snagajob.com'
    }
  },
  spestaging: {
    include: 'staging',
    smtpAuth: {
      host: 'smtp-spestaging42.msyscloud.com'
    },
    trackingDomains: {
      cnameValue: 'click.spestaging42.msyscloud.com'
    }
  },
  streetauth: {
    include: 'production',
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
    include: 'production',
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true
    },
    trackingDomains: {
      cnameValue: 'click.outbound.surveymonkey.com'
    }
  },
  talktalk: {
    include: 'production',
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
    include: 'production',
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true
    },
    trackingDomains: {
      cnameValue: 'tracking.mail.tobi.com'
    }
  },
  trulia: {
    include: 'production',
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true
    },
    trackingDomains: {
      cnameValue: 'click.prop.trulia.com'
    }
  },
  uber: {
    include: 'production',
    featureFlags: {
      allow_anyone_at_verification: true
    },
    trackingDomains: {
      cnameValue: 'click.uber.com'
    }
  },
  unear: {
    include: 'production',
    featureFlags: {
      allow_anyone_at_verification: true
    },
    trackingDomains: {
      cnameValue: 'track.unear.sparkpostelite.com'
    }
  },
  utilitywhouse: {
    include: 'production',
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
    include: 'production',
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
    include: 'production',
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true
    },
    trackingDomains: {
      cnameValue: 'click.sitemail.vivastreet.com'
    }
  },
  vivmail: {
    include: 'production',
    bounceDomains: {
      allowSubaccountDefault: false
    },
    featureFlags: {
      allow_anyone_at_verification: true
    }
  },
  wawd: {
    include: 'production',
    featureFlags: {
      allow_anyone_at_verification: true
    },
    trackingDomains: {
      cnameValue: 'track.sp.actionkit.com'
    }
  },
  wcare: {
    include: 'production',
    featureFlags: {
      allow_anyone_at_verification: true
    },
    trackingDomains: {
      cnameValue: 'track.wcare-m.sparkpostelite.com'
    }
  },
  workday: {
    include: 'production',
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true
    },
    trackingDomains: {
      cnameValue: 'track.workdayconnect.com'
    }
  },
  zillow: {
    include: 'production',
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true
    },
    trackingDomains: {
      cnameValue: 'click.mail.zillow.com'
    }
  },
  ziprealty: {
    include: 'production',
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true
    }
  },
  zip: {
    include: 'production',
    alias: 'ziprecruiter',
    featureFlags: {
      allow_anyone_at_verification: true
    },
    trackingDomains: {
      cnameValue: 'track.sparkpost.ziprecruiter.com'
    }
  },
  zynga: {
    include: 'production',
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true
    },
    trackingDomains: {
      cnameValue: 'track.spe.zyngamail.com'
    }
  },
  // dev: {
  //   host: 'localhost'
  // }
};

const defaults = Object.keys(tenants).map((tenant) => {
  const id = tenants[tenant].alias || tenant;

  return {
    apiBase: `//${id}.api.e.sparkpost.com/api/v1`,
    bounceDomains: {
      allowDefault: true,
      allowSubaccountDefault: true,
      cnameValue: `${id}.mail.e.sparkpost.com`
    },
    featureFlags: {},
    host: `${id}.e.sparkpost.com`,
    smtpAuth: {
      enabled: true,
      host: `${id}.smtp.e.sparkpost.com`,
      port: 587,
      username: id
    },
    tenant: tenant,
    trackingDomains: {
      cnameValue: `${id}.et.e.sparkpost.com`
    }
  };
});


// Shareable configurations
// TODO: Name them something other than environments
const contexts = {
  uat: {
    sentry: {
      projectId: 237611,
      publicKey: 'b63907577f9c4091895c49cc963fa8e4'
    },
    support: {
      algolia: {
        index: 'development_site_posts_support_article',
        apiKey: '9ba87280f36f539fcc0a318c2d4fcfe6',
        appID: 'SFXAWCYDV8'
      },
      enabled: true
    }
  },
  staging: {
    sentry: {
      projectId: 237612,
      publicKey: 'cb27762b225f4884b5e035580f1cc289'
    },
    support: {
      algolia: {
        index: 'staging_site_posts_support_article',
        apiKey: '9ba87280f36f539fcc0a318c2d4fcfe6',
        appID: 'SFXAWCYDV8'
      },
      enabled: true
    }
  },
  production: {
    sentry: {
      projectId: 237613,
      publicKey: '014f9707c27b4e7ea90aff051a82e561'
    },
    support: {
      algolia: {
        index: 'production_site_posts_support_article',
        apiKey: '9ba87280f36f539fcc0a318c2d4fcfe6',
        appID: 'SFXAWCYDV8'
      },
      enabled: true
    }
  }
};

// Merge
const configs = defaults.map((d) => {
  const tenant = tenants[d.tenant] || {};
  const config = _.merge(d, contexts[tenant.include], tenant);
  const sortedConfig = Object.keys(config).sort().reduce((accumulator, key) => ({
      ...accumulator,
      [key]: config[key]
    }), {});

  return sortedConfig;
});

const fs = require('fs');

configs.forEach(({ alias, host, include, ...config }) => {
  fs.writeFileSync(
    `./public/static/tenant-config/${host}/production.json`,
    JSON.stringify(config, null, '  ')
  )
});
