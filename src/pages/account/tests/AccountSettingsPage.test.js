import React from 'react';
import { shallow } from 'enzyme';
import { AccountSettingsPage } from '../AccountSettingsPage';

describe('AccountSettingsPage', () => {
  const baseProps = {
    currentUser: {
      customer: 123123
    }
  };

  function subject(props) {
    return shallow(<AccountSettingsPage {...baseProps} {...props} />);
  }

  it('renders', () => {
    expect(subject()).toMatchSnapshot();
  });
});
