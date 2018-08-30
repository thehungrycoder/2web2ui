const _ = require('lodash');
const contexts = require('./contexts');
const defaultTemplate = require('./defaultTemplate');

const constructConfig = (tenant) => _.merge(
  defaultTemplate(tenant),
  contexts[tenant.context],
  tenant
);

module.exports = constructConfig;
