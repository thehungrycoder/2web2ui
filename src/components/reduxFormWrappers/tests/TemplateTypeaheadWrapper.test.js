import React from 'react';
import cases from 'jest-in-case';
import { shallow } from 'enzyme';

import TemplateTypeaheadWrapper from '../TemplateTypeaheadWrapper';

cases('TemplateTypeaheadWrapper', ({ name, ...props }) => { // ignore test name
  const wrapper = shallow(<TemplateTypeaheadWrapper {...props} />);
  expect(wrapper).toMatchSnapshot();
}, {
  'renders templates typeahead': {
    input: {
      name: 'example',
      onChange: jest.fn(),
      value: 'template-one'
    },
    label: 'Start typing',
    meta: {},
    placeholder: 'example template',
    templates: [
      { value: 'template-one' },
      { value: 'template-two' }
    ]
  },
  'renders templates typeahead with error': {
    input: {
      name: 'example'
    },
    label: 'Start typing',
    meta: {
      active: false,
      error: 'Oh no!',
      touched: true
    },
    placeholder: 'example template',
    templates: [
      { value: 'template-one' },
      { value: 'template-two' }
    ]
  }
});
