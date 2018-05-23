import * as templatesHelper from '../templates';

describe('template helpers', () => {
  describe('normalizeFromAddress', () => {
    it('formats from address to obj', () => {
      expect(templatesHelper.normalizeFromAddress('me@mydomain.com')).toEqual({ name: null, email: 'me@mydomain.com' });
    });

    it('does not change format if it is already obj', () => {
      expect(templatesHelper.normalizeFromAddress({ email: 'me@mydomain.com' })).toEqual({ email: 'me@mydomain.com' });
    });
  });

  describe('normalizeTemplateFromAddress', () => {
    let template;
    beforeEach(() => {
      template = {
        name: 'Test Template',
        id: 'test-template',
        published: false,
        content: {
          from: 'sender@domain.com',
          html: '<h1>html values</h1>'
        }
      };
    });

    it('reformats string from to obj format', () => {
      expect(templatesHelper.normalizeTemplateFromAddress(template)).toMatchSnapshot();
    });

    it('does not change obj formatted from', () => {
      template.content.from = { name: 'sender name', email: 'sender@domain.com' };
      expect(templatesHelper.normalizeTemplateFromAddress(template)).toMatchSnapshot();
    });

    it('does not do anything if template is empty', () => {
      expect(templatesHelper.normalizeTemplateFromAddress({})).toEqual({});
      expect(templatesHelper.normalizeTemplateFromAddress(false)).toBe(false);
      expect(templatesHelper.normalizeTemplateFromAddress(null)).toBe(null);
    });
  });
});

