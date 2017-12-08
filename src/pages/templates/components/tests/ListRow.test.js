import { shallow } from 'enzyme';
import React from 'react';

import ListRow from '../ListRow';

describe('ListRow', () => {
  let wrapper;
  Date = jest.fn((a) => a); // eslint-disable-line

  beforeEach(() => {
    const props = {
      published: true,
      id: 'id',
      name: 'name',
      last_update_time: 'date'
    };

    wrapper = shallow(<ListRow {...props} />);
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('should render', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
