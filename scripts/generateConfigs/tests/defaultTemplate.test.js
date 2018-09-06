const cases = require('jest-in-case');
const defaultTemplate = require('../defaultTemplate');

cases('generateConfigs.defaultTemplate', ({ name, ...tenant }) => {
  expect(defaultTemplate(tenant)).toMatchSnapshot();
}, {
  'with only tenantId': {
    tenantId: 'testTenant'
  },
  'with alias': {
    alias: 'aTestTenant',
    tenantId: 'testTenant'
  }
});
