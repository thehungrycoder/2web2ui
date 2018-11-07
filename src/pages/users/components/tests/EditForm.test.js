import React from 'react';
import { shallow } from 'enzyme';

import EditForm from '../EditForm';

describe('Component: EditForm', () => {
  const baseProps = {
    isAccountSingleSignOnEnabled: true,
    currentUser: { name: 'current-user' },
    user: { access: 'admin', email: 'test-user@test.com', name: 'test-user' }
  };

  function subject(props) {
    return shallow(<EditForm {...baseProps} {...props} />);
  }

  it('should render', () => {
    expect(subject()).toMatchSnapshot();
  });

  it('should disable single sign-on checkbox and display instructions', () => {
    expect(subject({ isAccountSingleSignOnEnabled: false })).toMatchSnapshot();
  });

  it('should call submit handler', () => {
    const onSubmit = jest.fn();
    subject({ onSubmit }).find('form').first().simulate('submit');
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });
});
