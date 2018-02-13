import { formatSubaccount } from '../subaccounts';

const getState = jest.fn(() => ({
  apiKeys: {
    subaccountGrants: [
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
  createApiKey: true,
  keyName: 'test key all grants'
};

const keyFieldsSelect = {
  grantsRadio: 'select',
  createApiKey: true,
  keyName: 'test key select grants',
  grants: {
    'message_events/view': 'true',
    'message_events/write': false,
    'relay_webhooks/view': undefined,
    'relay_webhooks/write': null,
    'smtp/inject': 'true'
  }
};

describe('formatSubaccount helper tests', () => {
  it('should return name only', () => {
    const result = formatSubaccount({ name: 'mySubAccount' }, getState);
    expect(result).toMatchSnapshot();
  });

  it('should return api key - all grants', () => {
    const subaccount = {
      name: 'allThePerms',
      ...keyFieldsAll
    };
    const result = formatSubaccount(subaccount, getState);
    expect(result).toMatchSnapshot();
    expect(result).toHaveProperty('key_grants', [
      'message_events/view',
      'message_events/write',
      'relay_webhooks/view',
      'relay_webhooks/write',
      'smtp/inject'
    ]);
    expect(getState).toHaveBeenCalled();
  });

  it('should return api key - select grants', () => {
    const subaccount = {
      name: 'selectPerms',
      ...keyFieldsSelect
    };
    const result = formatSubaccount(subaccount, getState);
    expect(result).toMatchSnapshot();
    expect(result).toHaveProperty('key_grants', [
      'message_events/view',
      'smtp/inject'
    ]);
  });

  it('should return api key - valid ips', () => {
    const result = formatSubaccount(
      {
        name: 'mySubAccount',
        ...keyFieldsAll,
        validIps: '10.20.30.40, 10.20.30.0/24'
      },
      getState
    );
    expect(result).toMatchSnapshot();
  });

  it('should return subaccount with ip pool', () => {
    const result = formatSubaccount(
      {
        name: 'pool account',
        ipPool: 'marketing_ip_pool'
      },
      getState
    );
    expect(result).toMatchSnapshot();
  });

  it('should not set ip pool if default', () => {
    const result = formatSubaccount({
      name: 'subby',
      ipPool: 'default'
    },
    getState
    );
    expect(result).toMatchSnapshot();
  });
});
