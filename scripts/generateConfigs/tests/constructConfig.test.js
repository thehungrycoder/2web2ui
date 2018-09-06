const cases = require('jest-in-case');
const constructConfig = require('../constructConfig');

cases('generateConfigs.constructConfig', ({ name, ...tenant }) => {
  expect(constructConfig(tenant)).toMatchSnapshot();
}, {
  'with unknown environment': {
    tenantId: 'testTenant'
  },
  'with environment': {
    environment: 'uat',
    tenantId: 'testTenant'
  }
});
