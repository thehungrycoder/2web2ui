import { formatSubaccount } from '../subaccounts';

const getState = jest.fn(() => ({
  apiKeys: {
    grants: [
      { key: 'message_events/view' },
      { key: 'message_events/write' },
      { key: 'relay_webhooks/view' },
      { key: 'relay_webhooks/write' },
      { key: 'smtp/inject' }
    ]
  }
}));

const keyFieldsAll = {
  grantsRadio: 'all',
  keyName: 'test key all grants',
};

const keyFieldsSelect = {
  grantsRadio: 'all',
  keyName: 'test key select grants',
  grants: {
    'message_events/view': 'true',
    'message_events/write': false,
    'relay_webhooks/view': undefined,
    'relay_webhooks/write': null,
    'smtp/inject': 'true'
  }
};

test('name only', () => {
  const subaccount = { name: 'mySubAccount'}
  const result = formatKeyForRequest(key, getState);
  expect(result).toEqual({ name: 'mySubAccount', setup_api_key: false });
  expect(result).not.toHaveProperty('key_label');
  expect(result).not.toHaveProperty('ip_pool')
  expect(getState).not.toHaveBeenCalled();
});

test('with api key - all grants', () => {
  const subaccount = {
    name: 'allThePerms',
    ...keyFieldsAll
  };
  const result = formatKeyForRequest(subaccount, getState);
  expect(result.key_label).to.equal(keyFieldsAll.keyName);
  expect(result).toHaveProperty('grants', [
    'message_events/view',
    'message_events/write',
    'relay_webhooks/view',
    'relay_webhooks/write',
    'smtp/inject'
  ]);
  expect(getState).not.toHaveBeenCalled();
});

test('with api key - select grants', () => {
  const subaccount = {
    name: 'selectPerms',
    ...keyFieldsSelect
  };
  const result = formatKeyForRequest(subaccount, getState);
  expect(result.key_label).to.equal(keyFieldsSelect.keyName);
  expect(result).toHaveProperty('grants', [
    'message_events/view',
    'smtp/inject'
  ]);
  expect(getState).to.haveBeenCalled();
});

test('with api key - valid ips', () => {
  const result = formatKeyForRequest(
    {
      name: 'mySubAccount',
      ...keyFieldsAll
      validIps: '10.20.30.40, 10.20.30.0/24';
    },
    getState
  );

  expect(result).toHaveProperty('valid_ips', ['10.20.30.40', '10.20.30.0/24']);
});

test(with ip pool, () => {
  const result = formatSubaccount({
    name: 'pool account',
    ipPool: {
      id: 'marketing_ip_pool',
      name: 'Marketing IP Pool'
    }
  });
  expect(result.ip_pool).to.equal('marketing_ip_pool');
});
