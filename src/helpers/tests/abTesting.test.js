import { formatFormValues } from '../abTesting';

describe('A/B testing helper', () => {
  describe('formatFormValues', () => {
    let values;

    beforeEach(() => {
      values = {
        name: 'test_one',
        test_mode: 'bayesian',
        confidence_level: '0.91',
        audience_selection: 'sample_size',
        total_sample_size: '100'
      };
    });

    it('should omit sample size if using percent', () => {
      values.audience_selection = 'percent';
      expect(formatFormValues(values)).toMatchSnapshot();
    });

    it('should omit confidence level if in learning mode', () => {
      values.test_mode = 'learning';
      expect(formatFormValues(values)).toMatchSnapshot();
    });
  });
});
