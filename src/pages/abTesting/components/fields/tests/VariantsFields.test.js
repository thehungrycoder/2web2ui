import { shallow } from 'enzyme';
import React from 'react';
import VariantsFields, { RenderVariants, PercentField, SampleSizeField } from '../VariantsFields';

describe('Variants Fields Component', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      diabled: false,
      formValues: {}
    };

    wrapper = shallow(<VariantsFields {...props} />);
  });

  it('should render percent audience selection correctly', () => {
    wrapper.setProps({ formValues: { audience_selection: 'percent' }});
    expect(wrapper).toMatchSnapshot();
  });

  it('should render sample size audience selection correctly', () => {
    wrapper.setProps({ formValues: { audience_selection: 'sample_size' }});
    expect(wrapper).toMatchSnapshot();
  });

  describe('Field Array', () => {
    let fieldArray;
    let fieldArrayProps;

    beforeEach(() => {
      const fieldsSyntheticArray = (() => {
        const a = ['variant[1]','variant[2]'];
        a.push = jest.fn();
        a.remove = jest.fn();
        return a;
      })();

      fieldArrayProps = {
        fields: fieldsSyntheticArray,
        formValues: {
          audience_selection: 'percent'
        },
        disabled: false
      };
      fieldArray = shallow(<RenderVariants {...fieldArrayProps} />);
    });

    it('should render fields correctly with percent fields', () => {
      expect(fieldArray).toMatchSnapshot();
    });

    it('should render 1 field with disabled remove button', () => {
      fieldArrayProps.fields.pop();
      fieldArray = shallow(<RenderVariants {...fieldArrayProps} />);
      expect(fieldArray).toMatchSnapshot();
    });

    it('should render 20 fields with disabled add button', () => {
      fieldArrayProps.fields.length = 20;
      fieldArray = shallow(<RenderVariants {...fieldArrayProps} />);
      expect(fieldArray).toMatchSnapshot();
    });

    it('should render fields correctly with sample size fields', () => {
      fieldArray.setProps({ formValues: { audience_selection: 'sample_size' }});
      expect(fieldArray).toMatchSnapshot();
    });

    it('should handle add', () => {
      fieldArray.find('Button').last().simulate('click');
      expect(fieldArrayProps.fields.push).toHaveBeenCalled();
    });

    it('should handle remove', () => {
      fieldArray.find('Button').first().simulate('click');
      expect(fieldArrayProps.fields.remove).toHaveBeenCalledWith(0);
    });
  });

  describe('Percent Field', () => {
    it('should render correctly', () => {
      expect(shallow(<PercentField namespace='default_template' disabled={false} />)).toMatchSnapshot();
    });
  });

  describe('Sample Size Field', () => {
    it('should render correctly', () => {
      expect(shallow(<SampleSizeField namespace='default_template' disabled={false} />)).toMatchSnapshot();
    });
  });
});
