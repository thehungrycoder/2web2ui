const fs = require('fs');
const cases = require('jest-in-case');
const constructConfig = require('../constructConfig');
const tenants = require('../tenants');

const readProductionConfig = (host) => {
  const js = fs.readFileSync(`${process.cwd()}/tmp/tenant-config/${host}/production.js`, 'utf8');
  let window = {};

  eval(js); // sets window

  const {
    featureFlags: {
      allow_mailbox_verification, // all are true which is our default
      sending_domains_v2, // not used by ui
      templatesBySubaccount, // not used by ui
      usage_from_redis, // not used by ui
      ...featureFlags
    },
    gaTag, // no longer used
    smtpAuth: {
      commaFixer, // oh ansible
      ...smtpAuth
    },
    zuora,
    ...productionConfig
  } = window.SP.productionConfig;

  // Ignore zuora sandbox configurations because that is the default
  if (zuora && !/apisandbox/.test(zuora.baseUrl)) {
    productionConfig.zuora = zuora;
  }

  return {
    ...productionConfig,
    featureFlags,
    smtpAuth
  };
}

cases('generateConfigs', ({ name, ...tenant }) => {
  const { alias, context, host, tenantId, ...config } = constructConfig({ ...tenant, tenantId: name });
  const prevConfig = readProductionConfig(host);

  expect(prevConfig).toEqual(config);
}, tenants);

it('should not be missing tenants', () => {
  const prevTenantCount = fs.readdirSync(`${process.cwd()}/tmp/tenant-config`).length;
  const tenantCount = Object.keys(tenants).length;

  expect(prevTenantCount).toEqual(tenantCount);
});
