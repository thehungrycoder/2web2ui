const constructConfig = require('./constructConfig');
const constructContent = require('./constructContent');
const tenants = require('./tenants');
const writeContent = require('./writeContent');

// Generate all static tenant configurations
const generateConfigs = () => {
  Object.keys(tenants).forEach((environment) => {
    Object.keys(tenants[environment]).forEach((tenantId) => {
      const config = constructConfig({ ...tenants[tenantId], tenantId }, environment);
      const content = constructContent(config);

      writeContent(config.host, content);
    });
  })
}

module.exports = generateConfigs;
