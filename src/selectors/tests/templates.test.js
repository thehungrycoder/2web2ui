import cases from 'jest-in-case';
import * as selector from '../templates';

describe('Templates selectors', () => {
  const store = {
    templates: {
      list: [{ one: 'one' }, { two: 'two' }],
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
});
