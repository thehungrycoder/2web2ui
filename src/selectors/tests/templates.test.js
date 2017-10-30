import { getTemplateById, cloneTemplate } from '../templates';

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
    expect(getTemplateById(store, 'Ape')).toMatchSnapshot();
  });

  it('returns empty draft and published', () => {
    expect(getTemplateById(store, 'Nope')).toMatchSnapshot(); 
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

