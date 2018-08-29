import { shallow } from 'enzyme';
import React from 'react';
import VariantsView, { Variant, Engagement, PercentOrSample } from '../VariantsView';

describe('Variants View Component:', () => {

  describe('Top level Component', () => {
    it('should render correctly', () => {
      const props = {
        test: {
          default_template: { template_id: 'default' },
          variants: [
            { template_id: 'var1' },
            { template_id: 'var2' }
          ]
        }
      };
      expect(shallow(<VariantsView {...props} />)).toMatchSnapshot();
    });
  });

  describe('Variant Component:', () => {
    let wrapper;

    beforeEach(() => {
      wrapper = shallow(<Variant title='variant title' variant={{ template_id: 'temp_id' }} />);
    });

    it('should render correctly', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('should not render title if not supplied', () => {
      wrapper.setProps({ title: null });
      expect(wrapper.find('.SmallHeader')).toHaveLength(0);
    });
  });

  describe('Engagement Component:', () => {
    let wrapper;
    let props;

    beforeEach(() => {
      props = {
        variant: {
          template_id: 'temp_id',
          engagement_rate: 0.2,
          count_unique_confirmed_opened: 10,
          count_accepted: 100
        },
        showRate: true
      };
      wrapper = shallow(<Engagement {...props} />);
    });

    it('should render opens correctly', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('should render clicks correctly', () => {
      wrapper.setProps({ variant: {
        ...props.variant,
        count_unique_confirmed_opened: null,
        count_unique_clicked: 10
      }});
      expect(wrapper).toMatchSnapshot();
    });

    it('should not render when disabled', () => {
      wrapper.setProps({ showRate: false });
      expect(wrapper.html()).toBe(null);
    });
  });

  describe('PercentOrSample Component:', () => {
    it('should render sample size correctly', () => {
      expect(shallow(<PercentOrSample variant={{ sample_size: 1000 }} />)).toMatchSnapshot();
    });

    it('should render percent correctly', () => {
      expect(shallow(<PercentOrSample variant={{ percent: 50 }} />)).toMatchSnapshot();
    });

    it('should not render with no size provided', () => {
      expect(shallow(<PercentOrSample variant={{ somethingelse: 100 }} />).html()).toBe(null);
    });
  });
});
