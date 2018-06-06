import React from 'react';
import { shallow } from 'enzyme';

import SearchPanel from '../SearchPanel';

describe('SearchPanel', () => {
  it('renders search panel', () => {
    const wrapper = shallow(<SearchPanel />);
    expect(wrapper).toMatchSnapshot();
  });

  it('renders search panel with default search text', () => {
    const wrapper = shallow(<SearchPanel defaultSearchText="example" />);
    expect(wrapper).toMatchSnapshot();
  });
});
