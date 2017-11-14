import React from 'react';
import PanelLoading from '../PanelLoading';
import { render } from 'enzyme';

describe('Panel Loading', () => {
  test('render', () => {
    const wrapper = render(<PanelLoading />);

    expect(wrapper).toMatchSnapshot();
  });
});
