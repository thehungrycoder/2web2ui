import { shallow } from 'enzyme';
import React from 'react';

import ReadyFor from '../ReadyFor';

describe('Ready For Component', () => {
  let wrapper;

  beforeEach(() => {
    const props = {
      bounce: false,
      sending: true,
      dkim: true
    };

    wrapper = shallow(<ReadyFor {...props}/>);
  });

  it('renders sending and dkim correctly', () => {
    expect(wrapper).toMatchSnapshot();
  })

  it('renders null if all options are false', () => {
    wrapper.setProps({
      sending: false,
      dkim: false
    });

    expect(wrapper).toMatchSnapshot();
  });

  it('renders default bounce', () => {
    wrapper.setProps({
      bounce: true,
      sending: false,
      dkim: false,
      bounceDefault: true
    });

    expect(wrapper).toMatchSnapshot();
  });
});
