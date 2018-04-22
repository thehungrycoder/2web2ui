import * as apiKeys from '../api-keys';

describe('ApiKey Selectors', () => {
  let props;
  let store;


  beforeEach(() => {
    store = {
      apiKeys: {
        keys: [
          { id: 'Zebra' },
          { id: 'Ape', grants: ['grant one'], valid_ips: ['ip'], subaccount_id: 'subId' }
        ],
        grants: [
          { key: 'grant one' },
          { key: 'grant two' }
        ],
        subaccountGrants: [
          { key: 'sub grant one' },
          { key: 'sub grant two' }
        ],
        grantsLoading: true,
        subaccountGrantsLoading: false
      },
      subaccounts: {
        list: [
          { id: 'subId' }
        ]
      }
    };

    props = {
      match: {
        params: {
          id: 'Ape'
        }
      },
      location: {
        search: '?subaccount=subId'
      }
    };
  });

  it('gets grants', () => {
    expect(apiKeys.getGrants(store)).toMatchSnapshot();
  });

  it('gets subaccount grants', () => {
    expect(apiKeys.getSubaccountGrants(store)).toMatchSnapshot();
  });

  it('gets form loading', () => {
    expect(apiKeys.getFormLoading({ apiKeys: { grantsLoading: true, subaccountGrantsLoading: false }})).toEqual(true);

    expect(apiKeys.getFormLoading({ apiKeys: { grantsLoading: false, subaccountGrantsLoading: false }})).toEqual(false);

    expect(apiKeys.getFormLoading({ apiKeys: { grantsLoading: false, subaccountGrantsLoading: true }})).toEqual(true);
  });

  describe('getIsNew', () => {
    it('gets form is new - true', () => {
      props.match.params.id = 'new';
      expect(apiKeys.getIsNew(store, props)).toEqual(true);
    });

    it('gets form is new - false', () => {
      expect(apiKeys.getIsNew(store, props)).toEqual(false);
    });
  });

  describe('getInitialGrantsRadio', () => {
    it('gets form grants radio value - all (for new)', () => {
      props.match.params.id = 'new key';
      expect(apiKeys.getInitialGrantsRadio(store, props)).toEqual('all');
    });

    it('gets form grants radio value - all', () => {
      store.apiKeys.keys[1].grants = ['grant one', 'grant two'];
      expect(apiKeys.getInitialGrantsRadio(store, props)).toEqual('all');
    });

    it('gets form grants radio value - select', () => {
      //props.match.params.id = 'new key';
      store.apiKeys.keys[1].grants = ['grant 1'];
      expect(apiKeys.getInitialGrantsRadio(store, props)).toEqual('select');
    });
  });

  it('gets initial values', () => {
    props = {
      apiKey: {
        subaccount_id: 'subId',
        grants: ['grant one'],
        valid_ips: ['ip']
      },
      match: {
        params: {
          id: 'Ape'
        }
      },
      location: {
        search: '?subaccount=subId'
      }

    };
    expect(apiKeys.getInitialValues(store, props)).toMatchSnapshot();
  });

  it('should get initial subaccount grants', () => {
    expect(apiKeys.getInitialSubaccountGrants(store)).toMatchSnapshot();
  });

  it('should get all subaccount api keys', () => {
    const store = {
      apiKeys: {
        keys: [
          {
            subaccount_id: 101,
            name: 'subby key'
          },
          {
            name: 'master key'
          }
        ]
      }
    };

    const props = {
      id: 101
    };

    expect(apiKeys.getSubaccountApiKeys(store, props)).toMatchSnapshot();
  });

  it('it should return all api keys ready for sending', () => {
    const store = {
      apiKeys: {
        keys: [
          {
            grants: ['smtp/inject', 'metrics/view'],
            name: 'key1'
          },
          {
            grants: ['stuff/role'],
            name: 'dropped'
          },
          {
            grants: ['transmissions/modify', 'foo/bar'],
            name: 'key2'
          }
        ]
      }
    };

    expect(apiKeys.selectApiKeysForSending(store)).toMatchSnapshot();
  });

  describe('getCurrentAPIKey', () => {
    it('returns correct apiKey from store based on query string', () => {
      props.match.params.id = 'Zebra';
      props.location.search = '';
      expect(apiKeys.getCurrentApiKey(store, props)).toEqual(store.apiKeys.keys[0]);
    });

    it('returns correct apiKey if subaccount id provided in query string', () => {
      expect(apiKeys.getCurrentApiKey(store, props)).toEqual(store.apiKeys.keys[1]);
    });

    it('returns default empty apiKey if no matching found', () => {
      props.match.params.id = 'foobar';
      expect(apiKeys.getCurrentApiKey(store, props)).toEqual({});
    });
  });

  describe('canCurrentUserEditKey', () => {
    it('returns true for same user or key with subaccount_id', () => {
      expect(apiKeys.canCurrentUserEditKey({ username: 'abc' }, 'abc')).toBe(true);
      expect(apiKeys.canCurrentUserEditKey({ subaccount_id: 123 }, 'defg')).toBe(true);
    });

    it('returns false if usernames do not match', () => {
      expect(apiKeys.canCurrentUserEditKey({ username: 'abc' }, 'def')).toBe(false);
      expect(apiKeys.canCurrentUserEditKey({ username: 'abc', subaccount_id: 123 }, 'def')).toBe(false);
    });
  });

  describe('selectKeysForAccount', () => {
    it('should return a list of keys with ownership details', () => {
      const store = {
        currentUser: {
          username: 'abc'
        },
        apiKeys: {
          keys: [
            {
              // same username
              username: 'abc'
            },
            {
              // different username
              username: 'other'
            },
            {
              // no username but has a subaccount_id
              subaccount_id: 123
            },
            {
              // no username and no subaccount_id (should never happen but should produce false if so)
              lol: 'wut'
            }
          ]
        }
      };

      const list = apiKeys.selectKeysForAccount(store);
      expect(list.map((key) => key.canCurrentUserEdit)).toEqual([true, false, true, false]);
      expect(list).toMatchSnapshot();
    });
  });
});
