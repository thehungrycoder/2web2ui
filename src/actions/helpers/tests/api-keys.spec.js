import { formatKeyForRequest } from '../api-keys';

const getState = jest.fn(() => ({
  apiKeys: {
    grants: [
      { key: 'message_events/view' },
      { key: 'message_events/write' },
      { key: 'relay_webhooks/view' },
      { key: 'relay_webhooks/write' },
      { key: 'smtp/inject' },
      { key: 'account/read' },
      { key: 'account/read-write' }
    ]
  }
}));

const key = {
  grantsRadio: 'select',
  id: 'f52863d6-a118-45ff-8456-02b72e4e6cfe',
  label: 'test key',
  short_key: '3e1f',
  grants: {
    'message_events/view': 'true',
    'relay_webhooks/view': 'true'
  }
};

it('formats a simple key correctly', () => {
  const result = formatKeyForRequest(key, getState);
  expect(result).toEqual({
    data: {
      label: 'test key',
      grants: ['message_events/view', 'relay_webhooks/view'],
    },
    headers: {}
  });
  expect(result.data).not.toHaveProperty('valid_ips');
  expect(getState).not.toHaveBeenCalled();
});

it('formats a key with a subaccount correctly', () => {
  const result = formatKeyForRequest(
    {
      ...key,
      subaccount: {
        customer_id: 101,
        id: 101,
        compliance_status: 'active',
        status: 'active',
        name: 'sub1'
      }
    },
    getState
  );

  expect(result).toHaveProperty('headers', {
    'x-msys-subaccount': 101
  });
});

it('formats a key with all grants selected correctly', () => {
  const { data } = formatKeyForRequest(
    {
      ...key,
      grantsRadio: 'all'
    },
    getState
  );

  expect(data).toHaveProperty('grants', [
    'message_events/view',
    'message_events/write',
    'relay_webhooks/view',
    'relay_webhooks/write',
    'smtp/inject',
    'account/read',
    'account/read-write'
  ]);
});

it('formats valid_ips correctly', () => {
  const { data } = formatKeyForRequest(
    {
      ...key,
      validIps: '1.2.3.4, 5.6.3.1/24'
    },
    getState
  );

  expect(data).toHaveProperty('valid_ips', ['1.2.3.4', '5.6.3.1/24']);
});

it('removes falsy grants from the grants array', () => {
  const { data } = formatKeyForRequest(
    {
      ...key,
      grants: {
        'message_events/view': 'true',
        'message_events/write': false,
        'relay_webhooks/view': 'true',
        'relay_webhooks/write': null,
        'smtp/inject': 'true',
        'account/read': undefined,
        'account/read-write': 'true'
      }
    },
    getState
  );

  expect(data).toHaveProperty('grants', [
    'message_events/view',
    'relay_webhooks/view',
    'smtp/inject',
    'account/read-write'
  ]);
});
