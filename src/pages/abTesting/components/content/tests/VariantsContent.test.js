import { shallow } from 'enzyme';
import React from 'react';
import VariantsContent from '../VariantsContent';

describe('Variants Content Component', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<VariantsContent />);
  });

  it('should render help content', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render help content with percent disclaimer', () => {
    const formValues = { audience_selection: 'percent' };
    wrapper = shallow(<VariantsContent formValues={formValues} />);
    expect(wrapper).toMatchSnapshot();
  });
});
