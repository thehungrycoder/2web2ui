import { shallow } from 'enzyme';
import React from 'react';

import { Steps } from '../Steps';

describe('Steps', () => {
  let wrapper;
  const props = {
    location: {
      pathname: 'sending-domain'
    }
  };

  it('should render correctly', () => {
    wrapper = shallow(<Steps {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
