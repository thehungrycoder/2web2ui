import { getTemplateById } from '../templates';

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
