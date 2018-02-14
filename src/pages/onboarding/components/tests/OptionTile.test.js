import { shallow } from 'enzyme';
import React from 'react';

import OptionTile from '../OptionTile';

describe('OptionTile', () => {
  it('should render correctly with default wrapper', () => {
    const wrapper = shallow(<OptionTile label='tile label' content='tile content' />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly with an custom wrapper', () => {
    const wrapper = shallow(<OptionTile label='tile label' content='tile content' wrapper='span' />);
    expect(wrapper).toMatchSnapshot();
  });
});
