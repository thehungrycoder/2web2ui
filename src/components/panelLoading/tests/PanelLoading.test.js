import React from 'react';
import PanelLoading from '../PanelLoading';
import { shallow } from 'enzyme';

describe('Panel Loading', () => {
  test('render', () => {
    const wrapper = shallow(<PanelLoading />);

    expect(wrapper).toMatchSnapshot();
  });
});
