import cases from 'jest-in-case';
import * as selector from '../templates';

describe('Templates selectors', () => {
  const store = {
    templates: {
      list: [
        {
          name: 'unpublished',
          has_published: false,
          shared_with_subaccounts: false,
          subaccount_id: 101
        },
        {
          name: 'publishedSubaccount',
          has_published: true,
          shared_with_subaccounts: false,
          subaccount_id: 101
        },
        {
          name: 'publishedMaster',
          has_published: true,
          shared_with_subaccounts: false,
          subaccount_id: 0
        },
        {
          name: 'publishedShared',
          has_published: true,
          shared_with_subaccounts: true,
          subaccount_id: 0
        }
      ],
      testData: { test: 'data' },
      byId: {
        ape: {
          draft: {
            name: 'Ape',
            id: 'ape',
            published: false
          },
          published: {
            name: 'Ape',
            id: 'ape',
            published: true
          }
        }
      },
      contentPreview: {
        draft: {
          ape: {
            html: '<h1>Southeastern Asia</h1>',
            subject: 'New Location: Come visit me'
          }
        },
        published: {
          ape: {
            html: '<h1>Baltimore Zoo</h1>.',
            subject: 'Come visit me'
          }
        }
      }
    },
    sendingDomains: {
      list: [
        {
          domain: 'shared.com',
          shared_with_subaccounts: true,
          status: { ownership_verified: true, compliance_status: 'valid' }
        },
        {
          domain: 'masterOnly.com',
          status: { ownership_verified: true, compliance_status: 'valid' }
        },
        {
          domain: 'assignedToSub.com',
          subaccount_id: 101,
          status: { ownership_verified: true, compliance_status: 'valid' }
        },
        {
          domain: 'notvalid.com',
          status: { ownership_verified: false, compliance_status: 'valid' }
        }
      ]
    },
    form: {
      abTesting: {
        values: {
          subaccount: {
            id: 101
          }
        }
      }
    },
    currentUser: {
      has_subaccounts: true
    }
  };

  describe('Templates by id Selector', () => {
    it('returns template', () => {
      const props = { match: { params: { id: 'Ape' }}};
      expect(selector.selectTemplateById(store, props)).toMatchSnapshot();
    });

    it('returns empty draft and published', () => {
      const props = { match: { params: { id: 'Nope' }}};
      expect(selector.selectTemplateById(store, props)).toMatchSnapshot();
    });
  });

  cases('.selectDraftTemplate', ({ id }) => {
    expect(selector.selectDraftTemplate(store, id)).toMatchSnapshot();
  }, {
    'returns draft template': { id: 'ape' },
    'returns undefined when unknown': { id: 'unknown' }
  });

  cases('.selectPublishedTemplate', ({ id }) => {
    expect(selector.selectPublishedTemplate(store, id)).toMatchSnapshot();
  }, {
    'returns published template': { id: 'ape' },
    'returns undefined when unknown': { id: 'unknown' }
  });

  cases('.selectDraftTemplatePreview', ({ id }) => {
    expect(selector.selectDraftTemplatePreview(store, id)).toMatchSnapshot();
  }, {
    'returns preview of draft template': { id: 'ape' },
    'returns undefined when unknown': { id: 'unknown' }
  });

  cases('.selectPublishedTemplatePreview', ({ id }) => {
    expect(selector.selectPublishedTemplatePreview(store, id)).toMatchSnapshot();
  }, {
    'returns preview of draft template': { id: 'ape' },
    'returns undefined when unknown': { id: 'unknown' }
  });

  describe('cloneTemplate', () => {
    const template = {
      name: 'Test Template',
      id: 'test-template',
      published: false,
      content: {}
    };

    it('clones template', () => {
      expect(selector.cloneTemplate(template)).toMatchSnapshot();
    });
  });

  describe('getClonedTemplate', () => {
    it('should clone template if :id exist in state', () => {
      const props = { match: { params: { id: 'ape' }}};
      expect(selector.selectClonedTemplate(store, props)).toMatchSnapshot();
    });

    it('should not clone template if :id does not exist', () => {
      const props = { match: { params: { id: 'Nope' }}};
      expect(selector.selectClonedTemplate(store, props)).toMatchSnapshot();
    });
  });

  describe('selectTemplates', () => {
    it('should return a list', () => {
      expect(selector.selectTemplates(store)).toMatchSnapshot();
    });
  });

  describe('selectPublishedTemplates', () => {
    it('should return a list', () => {
      expect(selector.selectPublishedTemplates(store)).toMatchSnapshot();
    });
  });

  describe('selectDefaultTestData', () => {
    it('should return default test data', () => {
      expect(selector.selectDefaultTestData(store)).toMatchSnapshot();
    });
  });

  describe('selectTemplateTestData', () => {
    it('should return test data', () => {
      expect(selector.selectTemplateTestData(store)).toMatchSnapshot();
    });

    it('should return default data', () => {
      expect(selector.selectTemplateTestData({ templates: {}})).toMatchSnapshot();
    });
  });

  describe('selectDomainsBySubaccount', () => {
    it('should return domains with no subaccount filter', () => {
      expect(selector.selectDomainsBySubaccount(store, {})).toMatchSnapshot();
    });

    it('should return domains for a specific subaccount', () => {
      expect(selector.selectDomainsBySubaccount(store, { subaccountId: 101 })).toMatchSnapshot();
    });
  });

  describe('selectPublishedTemplatesBySubaccount', () => {
    it('should return published templates for master account', () => {
      store.form.abTesting.values.subaccount.id = 0;
      expect(selector.selectPublishedTemplatesBySubaccount(store, {})).toMatchSnapshot();
    });

    it('should return published templates for a specific subaccount', () => {
      store.form.abTesting.values.subaccount.id = 101;
      expect(selector.selectPublishedTemplatesBySubaccount(store, { subaccountId: 101 })).toMatchSnapshot();
    });

    it('should return published templates if no subaccounts exist', () => {
      store.currentUser.has_subaccounts = false;
      expect(selector.selectPublishedTemplatesBySubaccount(store)).toMatchSnapshot();
    });
  });
});
