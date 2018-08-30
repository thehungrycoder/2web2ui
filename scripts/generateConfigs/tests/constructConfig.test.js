const cases = require('jest-in-case');
const constructConfig = require('../constructConfig');

cases('generateConfigs.constructConfig', ({ name, ...tenant }) => {
  expect(constructConfig(tenant)).toMatchSnapshot();
}, {
  'with no context': {
    tenantId: 'testTenant'
  },
  'with context': {
    context: 'uat',
    tenantId: 'testTenant'
  }
});
