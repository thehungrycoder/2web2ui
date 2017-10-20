import { getfilterTemplates, getTemplateById } from '../templates';

describe('Templates by id Selector', () => {
  const store = {
    templates: {
      byId: {
        Ape: {
          name: 'Ape'
        }
      }
    }
  };

  it('returns template', () => {
    const props = { match: { params: { id: 'Ape' }}};
    expect(getTemplateById(store, props)).toMatchSnapshot();
  });

  it('returns empty draft and published', () => {
    const props = { match: { params: { id: 'Nope' }}};
    expect(getTemplateById(store, props)).toMatchSnapshot();
  });
});

describe('Filter Templates Selector', () => {
  const store = {
    templates: {
      list: [
        {
          name: 'Zebra',
          published: true,
          subaccount_id: '1'
        },
        {
          name: 'Ape',
          published: false
        },
        {
          name: 'shared',
          published: false,
          shared_with_subaccounts: true
        }
      ]
    },
    form: {
      templateFilters: {}
    }
  };

  it('returns unfiltered list', () => {
    expect(getfilterTemplates(store)).toMatchSnapshot();
  });

  it('returns searched list', () => {
    const search = { form: { templateFilters: { values: { search: 'ebra' }}}};
    expect(getfilterTemplates({ ...store, ...search })).toMatchSnapshot();
  });

  it('filters draft templates', () => {
    const search = { form: { templateFilters: { values: { status: { draft: true }}}}};
    expect(getfilterTemplates({ ...store, ...search })).toMatchSnapshot();
  });

  it('filters published templates', () => {
    const search = { form: { templateFilters: { values: { status: { published: true }}}}};
    expect(getfilterTemplates({ ...store, ...search })).toMatchSnapshot();
  });

  it('filters subaccount assigned', () => {
    const search = { form: { templateFilters: { values: { subaccount: { subaccount: true }}}}};
    expect(getfilterTemplates({ ...store, ...search })).toMatchSnapshot();
  });

  it('filters subaccount all', () => {
    const search = { form: { templateFilters: { values: { subaccount: { all: true }}}}};
    expect(getfilterTemplates({ ...store, ...search })).toMatchSnapshot();
  });

  it('filters subaccount master', () => {
    const search = { form: { templateFilters: { values: { subaccount: { master: true }}}}};
    expect(getfilterTemplates({ ...store, ...search })).toMatchSnapshot();
  });
});
