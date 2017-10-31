import { getTemplateById, cloneTemplate, getClonedTemplate } from '../templates';

describe('Templates selectors', ()=> {
  const store = {
    templates: {
      byId: {
        ape: {
          draft: {
            name: 'Ape',
            id: 'ape',
            published: false,
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
      expect(getTemplateById(store, props)).toMatchSnapshot();
    });

    it('returns empty draft and published', () => {
      const props = { match: { params: { id: 'Nope' }}};		
      expect(getTemplateById(store, props)).toMatchSnapshot(); 
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
        expect(cloneTemplate(template)).toMatchSnapshot();
    });
  });

  describe('getClonedTemplate', ()=> {
    it('should clone template if :id exist in state', () => {
      const props = { match: { params: { id: 'ape' }}};		
      expect(getClonedTemplate(store, props)).toMatchSnapshot();
    });

    it('should not clone template if :id does not exist', () => {
      const props = { match: { params: { id: 'Nope' }}};		
      expect(getClonedTemplate(store, props)).toMatchSnapshot();
    });
  });
});