import { shallow } from 'enzyme';
import React from 'react';

import { Form } from '../Form';

describe('Template Form', () => {
  let wrapper;

  const props = {
    domains: [
      { domain: 'test.com' },
      { domain: 'verified.com' }
    ],
    listDomains: jest.fn(),
    change: jest.fn(),
    newTemplate: false,
    name: 'form-name'
  }

  beforeEach(() => {
    wrapper = shallow(<Form {...props} />);
  })

  it('should render', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
