// Generate default configurations with a tenant
const defaultTemplate = (tenant) => {
  const identifier = tenant.alias || tenant.tenantId;

  return {
    apiBase: `https://${identifier}.api.e.sparkpost.com/api`,
    bounceDomains: {
      allowDefault: true,
      allowSubaccountDefault: true,
      cnameValue: `${identifier}.mail.e.sparkpost.com`
    },
    featureFlags: {},
    host: `${identifier}.e.sparkpost.com`,
    smtpAuth: {
      enabled: true,
      host: `${identifier}.smtp.e.sparkpost.com`,
      port: 587,
      username: identifier
    },
    support: {
      algolia: {
        apiKey: '9ba87280f36f539fcc0a318c2d4fcfe6',
        appID: 'SFXAWCYDV8'
      },
      enabled: true
    },
    tenant: tenant.tenantId,
    trackingDomains: {
      cnameValue: `${identifier}.et.e.sparkpost.com`
    }
  };
};

module.exports = defaultTemplate;
