import React from 'react';
import { DetachedItem as Item } from '../Item';
import { shallow } from 'enzyme';

describe('Navigation', () => {
  test('Item renders a top level link correctly', () => {
    const item = shallow(
      <Item
        to='/to'
        icon='icon'
        label='label'
        location={ { pathname: 'to' } }
      />
    )
    expect(item).toMatchSnapshot();
  });
});
