const constructConfig = require('./constructConfig');
const constructContent = require('./constructContent');
const tenants = require('./tenants');
const writeContent = require('./writeContent');

// Generate all static tenant configurations
Object.keys(tenants).forEach((tenantId) => {
  const config = constructConfig({ ...tenants[tenantId], tenantId });
  const content = constructContent(config);

  writeContent(config.host, content);
});
