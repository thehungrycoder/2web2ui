const _ = require('lodash');
const environments = require('./environments');
const defaultTemplate = require('./defaultTemplate');

const constructConfig = (tenant, environment) => _.merge(
  defaultTemplate(tenant),
  environments[environment],
  tenant
);

module.exports = constructConfig;
