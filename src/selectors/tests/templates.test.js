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
