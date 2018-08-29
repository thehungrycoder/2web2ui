const _ = require('lodash');
const contexts = require('./configs/contexts');
const defaultTemplate = require('./configs/defaultTemplate');
const tenants = require('./configs/tenants');

// Merge
const configs = Object.keys(tenants).map((tenantId) => {
  const tenant = tenants[tenantId];
  const defaultConfig = defaultTemplate({ ...tenant, tenantId });
  const config = _.merge(defaultConfig, contexts[tenant.include], tenant);
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
