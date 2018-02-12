import React from 'react';
import cases from 'jest-in-case';
import { shallow } from 'enzyme';

import PoolTypeaheadWrapper from '../PoolTypeaheadWrapper';

cases('PoolTypeaheadWrapper', ({ name, ...props }) => { // ignore test name
  const wrapper = shallow(<PoolTypeaheadWrapper {...props} />);
  expect(wrapper).toMatchSnapshot();
}, {
  'renders pool typeahead': {
    input: {
      name: 'example',
      onChange: jest.fn(),
      value: 'Example Value'
    },
    pools: []
  }
});
