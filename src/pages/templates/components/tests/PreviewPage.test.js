import React from 'react';
import cases from 'jest-in-case';
import { shallow } from 'enzyme';

import PreviewPage from '../PreviewPage';

const TEST_CASES = {
  'renders loading page when template is undefined': {
    template: undefined
  },
  'renders preview page': {
    editTemplatePath: '/path/to/edit',
    label: 'Draft',
    template: {
      content: {
        html: '<html />'
      },
      name: 'Test Template'
    }
  }
};

cases('PreviewPage', (props) => {
  const wrapper = shallow(<PreviewPage {...props} />);
  expect(wrapper).toMatchSnapshot();
}, TEST_CASES);
