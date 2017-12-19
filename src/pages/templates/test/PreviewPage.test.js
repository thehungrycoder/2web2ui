import React from 'react';
import cases from 'jest-in-case';
import { shallow } from 'enzyme';

import { PreviewPage } from '../PreviewPage';

const TEST_CASES = {
  'renders loading': { template: undefined }
};

cases('PreviewPage', (props) => {
  const wrapper = shallow(<PreviewPage {...props} />);
  expect(wrapper).toMatchSnapshot();
}, TEST_CASES);
