/**
 * This is a list of all production tenants and their specific configurations
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
const productionTenants = {
  '247sports': {
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true
    },
    trackingDomains: {
      cnameValue: 'track.247sports-m.msyscloud.com'
    }
  },
  amex: {
    alias: 'amexgbt',
    bounceDomains: {
      allowDefault: false
    },
    trackingDomains: {
      cnameValue: 'track.amexgbt-m.sparkpostelite.com'
    }
  },
  spceu: {
    apiBase: 'https://api.eu.sparkpost.com/api',
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
    apiBase: 'https://api.sparkpost.com/api',
    bounceDomains: {
      cnameValue: 'sparkpostmail.com'
    },
    crossLinkTenant: 'spceu',
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true,
      has_signup: true
    },
    gtmId: 'GTM-WN7C84',
    host: 'app.sparkpost.com',
    nextHost: 'phoenix-next-prd.sparkpost.com',
    originHost: 'phoenix-origin-prd.sparkpost.com',
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
    alias: 'atlassian',
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true
    }
  },
  becordial: {
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true
    }
  },
  booking: {
    bounceDomains: {
      allowSubaccountDefault: false
    },
    featureFlags: {
      allow_anyone_at_verification: true
    }
  },
  creditag: {
    alias: 'ca',
    bounceDomains: {
      allowSubaccountDefault: false
    }
  },
  capone: {
    alias: 'capitalone',
    featureFlags: {
      allow_anyone_at_verification: true
    },
    trackingDomains: {
      cnameValue: 'click.c1-t.msyscloud.com'
    }
  },
  careerb: {
    alias: 'careerbuilder',
    featureFlags: {
      allow_anyone_at_verification: true
    },
    trackingDomains: {
      cnameValue: 'click.sites.careerbuilder.com'
    }
  },
  cerner: {
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true
    },
    trackingDomains: {
      cnameValue: 'click.mail.cerner.com'
    }
  },
  clipper: {
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true
    },
    trackingDomains: {
      cnameValue: 'track.clipper.sparkpostelite.com'
    }
  },
  caponeuk: {
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
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true
    },
    trackingDomains: {
      cnameValue: 'track.sp.crdl.io'
    }
  },
  coursera: {
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true
    },
    trackingDomains: {
      cnameValue: 'click.mail.coursera.org'
    }
  },
  creator: {
    bounceDomains: {
      allowSubaccountDefault: false
    },
    featureFlags: {
      allow_anyone_at_verification: true
    }
  },
  dalenys: {
    bounceDomains: {
      allowSubaccountDefault: false
    },
    featureFlags: {
      allow_anyone_at_verification: true
    }
  },
  demo: {
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true
    },
    trackingDomains: {
      cnameValue: 'track.demo-t.sparkpostelite.com'
    }
  },
  dhi: {
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true
    }
  },
  disney: {
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true
    }
  },
  ebates: {
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true
    },
    trackingDomains: {
      cnameValue: 'link.ebates.com'
    }
  },
  eonian: {
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true
    },
    trackingDomains: {
      cnameValue: 'link.eleatech.io'
    }
  },
  fintimes: {
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
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true
    },
    trackingDomains: {
      cnameValue: 'track.p.gilt.com'
    }
  },
  gmc: {
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true
    },
    trackingDomains: {
      cnameValue: 'click.gmc.sparkpostelite.com'
    }
  },
  guardian: {
    featureFlags: {
      allow_anyone_at_verification: true
    },
    trackingDomains: {
      cnameValue: 'click.notifications.glic.com'
    }
  },
  hubspot: {
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true
    }
  },
  hubspoteast: {
    trackingDomains: {
      cnameValue: 'track.hubspoteast.sparkpostelite.com'
    }
  },
  icims: {
    bounceDomains: {
      allowSubaccountDefault: false
    },
    featureFlags: {
      allow_anyone_at_verification: true
    }
  },
  ims: {
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
    featureFlags: {
      allow_anyone_at_verification: true
    },
    trackingDomains: {
      cnameValue: 'track.intercom-t.sparkpostelite.com'
    }
  },
  jane: {
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true
    },
    trackingDomains: {
      cnameValue: 'click.m.jane.com'
    }
  },
  kayak: {
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true
    },
    trackingDomains: {
      cnameValue: 'track-kayak.sparkpostelite.com'
    }
  },
  linkedin: {
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true
    },
    trackingDomains: {
      cnameValue: 'track.linkedin.sparkpostelite.com'
    }
  },
  massdrop: {
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true
    },
    trackingDomains: {
      cnameValue: 't.massdrop.com'
    }
  },
  mtas4tenant: {
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true
    },
    smtpAuth: {
      alternativePort: 2525
    }
  },
  nyl: {
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true
    }
  },
  nyt: {
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true
    }
  },
  ometria: {
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
    featureFlags: {
      allow_anyone_at_verification: true
    },
    trackingDomains: {
      cnameValue: 'post.pinterest.com'
    }
  },
  productionmtas: {
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true
    },
    smtpAuth: {
      alternativePort: 2525
    }
  },
  productionmtas2: {
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true
    },
    smtpAuth: {
      alternativePort: 2525
    }
  },
  sas: {
    bounceDomains: {
      allowDefault: false,
      allowSubaccountDefault: false
    },
    trackingDomains: {
      cnameValue: 'track.sp.ci360.sas.com'
    }
  },
  schoolm: {
    featureFlags: {
      allow_anyone_at_verification: true
    },
    trackingDomains: {
      cnameValue: 'track.spe.schoolmessenger.com'
    }
  },
  selective: {
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true
    }
  },
  sitecoreeu: {
    alias: 'sitecore-eu',
    bounceDomains: {
      allowSubaccountDefault: false
    },
    featureFlags: {
      allow_anyone_at_verification: true
    }
  },
  sitecore: {
    featureFlags: {
      allow_anyone_at_verification: true
    },
    trackingDomains: {
      cnameValue: 'click.sitecoremail.com'
    }
  },
  snagajob: {
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true
    },
    trackingDomains: {
      cnameValue: 'click.email.snagajob.com'
    }
  },
  streetauth: {
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
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true
    },
    trackingDomains: {
      cnameValue: 'click.outbound.surveymonkey.com'
    }
  },
  talktalk: {
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
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true
    },
    trackingDomains: {
      cnameValue: 'tracking.mail.tobi.com'
    }
  },
  trulia: {
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true
    },
    trackingDomains: {
      cnameValue: 'click.prop.trulia.com'
    }
  },
  uber: {
    featureFlags: {
      allow_anyone_at_verification: true
    },
    trackingDomains: {
      cnameValue: 'click.uber.com'
    }
  },
  unear: {
    featureFlags: {
      allow_anyone_at_verification: true
    },
    trackingDomains: {
      cnameValue: 'track.unear.sparkpostelite.com'
    }
  },
  utilitywhouse: {
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
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true
    },
    trackingDomains: {
      cnameValue: 'click.sitemail.vivastreet.com'
    }
  },
  vivmail: {
    bounceDomains: {
      allowSubaccountDefault: false
    },
    featureFlags: {
      allow_anyone_at_verification: true
    }
  },
  wawd: {
    featureFlags: {
      allow_anyone_at_verification: true
    },
    trackingDomains: {
      cnameValue: 'track.sp.actionkit.com'
    }
  },
  wcare: {
    featureFlags: {
      allow_anyone_at_verification: true
    },
    trackingDomains: {
      cnameValue: 'track.wcare-m.sparkpostelite.com'
    }
  },
  workday: {
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true
    },
    trackingDomains: {
      cnameValue: 'track.workdayconnect.com'
    }
  },
  zillow: {
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true
    },
    trackingDomains: {
      cnameValue: 'click.mail.zillow.com'
    }
  },
  ziprealty: {
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true
    }
  },
  zip: {
    alias: 'ziprecruiter',
    featureFlags: {
      allow_anyone_at_verification: true
    },
    trackingDomains: {
      cnameValue: 'track.sparkpost.ziprecruiter.com'
    }
  },
  zynga: {
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true
    },
    trackingDomains: {
      cnameValue: 'track.spe.zyngamail.com'
    }
  }
};

module.exports = productionTenants;
