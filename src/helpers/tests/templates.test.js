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

  describe('resolveTemplateStatus', () => {
    it('resolves a published only template', () => {
      const result = templatesHelper.resolveTemplateStatus({
        has_published: true,
        has_draft: true,
        published: true
      });

      expect(result).toMatchSnapshot();

      expect(templatesHelper.resolveTemplateStatus({
        has_published: true,
        has_draft: false,
        published: true
      })).toEqual(result);
    });

    it('resolves a draft only template', () => {
      expect(templatesHelper.resolveTemplateStatus({
        has_published: false,
        has_draft: true,
        published: false
      })).toMatchSnapshot();
    });

    it('resolves a published with unpublished changes template', () => {
      expect(templatesHelper.resolveTemplateStatus({
        has_published: true,
        has_draft: true,
        published: false
      })).toMatchSnapshot();
    });
  });

  describe('filterTemplatesBySubaccount', () => {
    let templates;
    beforeEach(() => {
      templates = [
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
      ];
    });

    it('should return published templates for master account', () => {
      expect(templatesHelper.filterTemplatesBySubaccount({ templates, subaccountId: null, hasSubaccounts: true })).toMatchSnapshot();
    });

    it('should return published templates for a specific subaccount', () => {
      expect(templatesHelper.filterTemplatesBySubaccount({ templates, subaccountId: 101, hasSubaccounts: true })).toMatchSnapshot();
    });

    it('should return published templates if no subaccounts exist', () => {
      expect(templatesHelper.filterTemplatesBySubaccount({ templates, subaccountId: null , hasSubaccounts: false })).toMatchSnapshot();
    });
  });
});
