import React from 'react';
import { shallow } from 'enzyme';
import Billboard from '../Billboard';

describe('Billboard', () => {
  it('renders signle cell table row', () => {
    const wrapper = shallow(
      <Billboard colSpan={7}>
        <h1>Test Example</h1>
      </Billboard>
    );

    expect(wrapper).toMatchSnapshot();
  });
});
