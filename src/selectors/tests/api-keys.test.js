import * as apiKeys from '../api-keys';

describe('ApiKey Selectors', () => {
  const store = {
    apiKeys: {
      keys: [
        { id: 'Zebra' },
        { id: 'Ape' }
      ],
      grants: [
        { key: 'grant one' },
        { key: 'grant two' },
      ],
      subaccountGrants: [
        { key: 'sub grant one' },
        { key: 'sub grant two' },
      ],
      grantsLoading: false,
      subaccountGrantsLoading: false
    },
    subaccounts: {
      listLoading: true,
      list: [
        { id: 'subId' }
      ]
    }
  };

  it('returns single api key', () => {
    expect(apiKeys.getApiKey(store, { match : { params : { id: 'Ape' }}})).toMatchSnapshot();
  });

  it('gets grants', () => {
    expect(apiKeys.getGrants(store)).toMatchSnapshot();
  });

  it('gets subaccount grants', () => {
    expect(apiKeys.getSubaccountGrants(store)).toMatchSnapshot();
  });

  it('gets form loading', () => {
    expect(apiKeys.getFormLoading(store)).toMatchSnapshot();
  });

  it('gets form is new - true', () => {
    expect(apiKeys.getIsNew(store, { })).toMatchSnapshot();
  });

  it('gets form is new - false', () => {
    expect(apiKeys.getIsNew(store, { apiKey: { not: 'empty' }})).toMatchSnapshot();
  });

  it('gets form grants radio value - all', () => {
    expect(apiKeys.getInitialGrantsRadio(store, { })).toMatchSnapshot();
  });

  it('gets form grants radio value - select', () => {
    expect(apiKeys.getInitialGrantsRadio(store, { apiKey: { grants: ['grant'] }})).toMatchSnapshot();
  });

  it('gets initial subaccount', () => {
    expect(apiKeys.getInitialSubaccount(store, { apiKey: { subaccount_id: 'subId' }})).toMatchSnapshot();
  });

  it('gets initial values', () => {
    const props = {
      apiKey: {
        subaccount_id: 'subId',
        grants: ['grant'],
        valid_ips: ['ip']
      }
    }
    expect(apiKeys.getInitialValues(store, props)).toMatchSnapshot();
  });
});
