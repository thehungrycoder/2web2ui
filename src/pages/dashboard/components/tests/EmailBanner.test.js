import { shallow } from 'enzyme';
import React from 'react';

import EmailBanner from '../EmailBanner';

describe('Component: Email Banner', () => {
  const props = {
    verifying: false,
    handleResend: jest.fn(() => true)
  };

  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<EmailBanner {...props} />);
  });

  it('should show default email banner', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should show sending sending content', () => {
    wrapper.setProps({ verifying: true });
    expect(wrapper).toMatchSnapshot();
  });

});
