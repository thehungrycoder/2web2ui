import { shallow } from 'enzyme';
import React from 'react';

import { VerifyEmailBanner } from '../VerifyEmailBanner';

describe('Component: Verify Email Banner', () => {
  const props = {
    verifying: false,
    showAlert: jest.fn(),
    verifyEmail: jest.fn(() => Promise.resolve())
  };

  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<VerifyEmailBanner {...props} />);
  });

  it('should show default email banner', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should show sending sending content', () => {
    wrapper.setProps({ verifying: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('should show success alert on successful email verification', async () => {
    await wrapper.instance().handleClick();

    expect(props.verifyEmail).toHaveBeenCalledTimes(1);
    expect(props.showAlert).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'success' })
    );
  });
});
