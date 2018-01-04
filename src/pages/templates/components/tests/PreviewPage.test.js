import React from 'react';
import cases from 'jest-in-case';
import { shallow } from 'enzyme';

import PreviewPage from '../PreviewPage';

const TEST_CASES = {
  'renders loading page when template is undefined': {
    loading: true
  },
  'renders preview page': {
    editTemplatePath: '/path/to/edit',
    loading: false,
    mode: 'draft',
    preview: {
      from: {
        email: 'test@example.com'
      },
      html: '<html />',
      subject: 'Test Subject'
    },
    template: {
      name: 'Test Template'
    }
  }
};

cases('PreviewPage', (props) => {
  const wrapper = shallow(<PreviewPage {...props} />);
  expect(wrapper).toMatchSnapshot();
}, TEST_CASES);
