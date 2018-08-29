const fs = require('fs');
const _ = require('lodash');
const prettier = require('prettier');
const contexts = require('./configs/contexts');
const defaultTemplate = require('./configs/defaultTemplate');
const tenants = require('./configs/tenants');

// merge defaults and context for each tenant configuration
const configs = Object.keys(tenants).map((tenantId) => {
  const tenant = tenants[tenantId];
  const defaultConfig = defaultTemplate({ ...tenant, tenantId });

  return _.merge(defaultConfig, contexts[tenant.extends], tenant);
});

// generate and write configuration file
configs.forEach(({ alias, context, host, ...config }) => {
  const dir = `./public/static/tenant-config/${host}`;
  const content = `
    window.SP = window.SP || {};
    window.SP.productionConfig = ${JSON.stringify(config)};
  `;
  const formattedContent = prettier.format(content, { parser: 'babylon', singleQuote: true });

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  fs.writeFileSync(`${dir}/production.js`, formattedContent);
});
