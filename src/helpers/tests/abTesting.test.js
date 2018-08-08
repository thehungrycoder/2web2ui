import * as helpers from '../abTesting';

describe('A/B testing helper', () => {
  describe('formatFormValues', () => {
    let values;

    beforeEach(() => {
      values = {
        name: 'test_one',
        test_mode: 'bayesian',
        confidence_level: '0.91',
        audience_selection: 'sample_size',
        total_sample_size: '100',
        dates: {
          from: '2018-08-00T12:00:00.978Z',
          to: '2018-08-09T12:00:00.978Z'
        },
        default_template: {
          template_object: { id: 'template_one', should_not: 'be passed through' },
          sample_size: '200'
        },
        variants: [
          {
            template_object: { id: 'template_two', should_not: 'be passed through' },
            sample_size: '200'
          },
          {
            template_object: { id: 'template_three', should_not: 'be passed through' },
            sample_size: '200'
          }
        ]
      };
    });

    it('should omit sample size if using percent', () => {
      values.audience_selection = 'percent';
      expect(helpers.formatFormValues(values)).toMatchSnapshot();
    });

    it('should omit confidence level if in learning mode', () => {
      values.test_mode = 'learning';
      expect(helpers.formatFormValues(values)).toMatchSnapshot();
    });
  });

  describe('reduceTemplateObject', () => {
    it('should pass through template id', () => {
      expect(helpers.reduceTemplateObject({ template_id: 'template_two', sample_size: '500' })).toMatchSnapshot();
    });

    it('should handle an undefined template', () => {
      expect(helpers.reduceTemplateObject()).toMatchSnapshot();
    });
  });

  describe('findTemplateObject', () => {
    it('should find template objects', () => {
      const templates = [
        { id: 'template_one', full: 'template 1' },
        { id: 'template_two', full: 'template 2' },
        { id: 'template_thre', full: 'template 3' }
      ];
      expect(helpers.findTemplateObject(templates, { template_id: 'template_two', sample_size: '500' })).toMatchSnapshot();
    });
  });
});
