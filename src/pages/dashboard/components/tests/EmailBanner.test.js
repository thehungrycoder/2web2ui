import { shallow } from 'enzyme';
import React from 'react';

import EmailBanner from '../EmailBanner';

describe('Component: Email Banner', () => {
  const props = {
    sendingStatus: 'not-sending',
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
    wrapper.setProps({ sendingStatus: 'sending' });
    expect(wrapper).toMatchSnapshot();
  });

  it('should show sent content', () => {
    wrapper.setProps({ sendingStatus: 'sent' });
    expect(wrapper).toMatchSnapshot();
  });

});
