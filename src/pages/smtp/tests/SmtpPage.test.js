import { shallow } from 'enzyme';
import React from 'react';

import { SmtpPage } from '../SmtpPage';

describe('Page: Smtp tests', () => {
  const props = {
    account: {
      options: {
        smtp_tracking_default: true
      }
    },
    updateAccount: jest.fn(() => Promise.resolve()),
    showAlert: jest.fn()
  };
  let wrapper;
  let instance;

  beforeEach(() => {
    wrapper = shallow(<SmtpPage {...props} />);
    instance = wrapper.instance();
  });

  it('should render page correctly with defaults', () => {
    expect(wrapper).toMatchSnapshot();
  });

  describe('toggleTracking', () => {
    it('should show success alert after updating account', async() => {
      await instance.toggleTracking();
      expect(instance.props.updateAccount).toHaveBeenCalledWith({
        options: {
          smtp_tracking_default: false
        }
      });
      expect(instance.props.showAlert).toHaveBeenCalledWith({
        type: 'success',
        message: 'Default SMTP Engagement Tracking updated.'
      });

    });

    it('should show error alert when update account fails', async() => {
      wrapper.setProps({ updateAccount: jest.fn(() => Promise.reject({ message: 'no no no' })) });
      await instance.toggleTracking();
      expect(instance.props.updateAccount).toHaveBeenCalledWith({
        options: {
          smtp_tracking_default: false
        }
      });
      expect(instance.props.showAlert).toHaveBeenCalledWith({
        type: 'error',
        message: 'Unable to update SMTP Engagement Tracking.',
        details: 'no no no'
      });

    });
  });

});
