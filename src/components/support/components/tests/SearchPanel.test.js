import React from 'react';
import { shallow } from 'enzyme';

import { SearchPanel } from '../SearchPanel';

describe('Search Panel Component', () => {
  let wrapper;

  beforeEach(() => {
    const props = {
      toggleForm: jest.fn(),
      issues: [1,2]
    };
    wrapper = shallow(<SearchPanel {...props} />);
  });

  it('should render', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should not render cta without support issues', () => {
    wrapper.setProps({ issues: []});
    expect(wrapper).toMatchSnapshot();
  });
});
