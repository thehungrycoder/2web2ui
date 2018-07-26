import { shallow } from 'enzyme';
import React from 'react';
import TemplateTypeaheadItem from '../TemplateTypeaheadItem';

describe('Template Typeahead Item', () => {
  it('should render correctly', () => {
    const wrapper = shallow(<TemplateTypeaheadItem id={'tmpl-101'} />);
    expect(wrapper).toMatchSnapshot();
  });
});
