import React from 'react';
import Item from '../Item';
import { render } from 'enzyme';
import { MemoryRouter } from 'react-router-dom'


describe('Navigation', () => {

  test('Item renders a link correctly', () => {
    const item = render(
      <MemoryRouter>
        <Item
          to='/to'
          icon='Mail'
          label='label'
          location={ { pathname: 'to' } }
        />
      </MemoryRouter>
    );
    expect(item).toMatchSnapshot();
  });

  test('Item renders children correctly', () => {
    const location = { pathname: 'to' };
    const children = [
      { to: '/child1', label: 'child 1', location},
      { to: '/child2', label: 'child 2', location}
    ];
    const item = render(
      <MemoryRouter>
        <Item
          to='/to'
          icon='Mail'
          label='label'
          children={children}
          location={location}
        />
      </MemoryRouter>
    );
    expect(item).toMatchSnapshot();
  });
});
