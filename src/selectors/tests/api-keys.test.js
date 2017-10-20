import { getFilteredKeys } from '../api-keys';

describe('Filter Api Keys Selector', () => {
  const store = {
    apiKeys: {
      keys: [
        {
          label: 'One',
          subaccount_id: 1
        },
        {
          label: 'Two'
        }
      ]
    },
    form: {
      apiKeysFilters: {}
    }
  };

  it('returns unfiltered list', () => {
    expect(getFilteredKeys(store)).toMatchSnapshot();
  });

  it('filters search', () => {
    const search = { form: { apiKeysFilters: { values: { search: 'tw' }}}};
    expect(getFilteredKeys({ ...store, ...search })).toMatchSnapshot();
  });

  it('filters assigned to subaccount', () => {
    const search = { form: { apiKeysFilters: { values: { subaccount: { subaccount: true }}}}};
    expect(getFilteredKeys({ ...store, ...search })).toMatchSnapshot();
  });

  it('filters assigned to master', () => {
    const search = { form: { apiKeysFilters: { values: { subaccount: { master: true }}}}};
    expect(getFilteredKeys({ ...store, ...search })).toMatchSnapshot();
  });

  it('filters all subaccount options', () => {
    const search = { form: { apiKeysFilters: { values: { subaccount: { master: true, subaccount: true }}}}};
    expect(getFilteredKeys({ ...store, ...search })).toMatchSnapshot();
  });
});
