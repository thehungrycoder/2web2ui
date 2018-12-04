import React from 'react';
import { shallow } from 'enzyme';
import { SingleSignOnPanel } from '../SingleSignOnPanel';

describe('SingleSignOnPanel', () => {
  let props;
  let wrapper;

  beforeEach(() => {
    props = {
      getAccountSingleSignOnDetails: jest.fn(),
      updateAccountSingleSignOn: jest.fn()
    };
    wrapper = shallow(<SingleSignOnPanel {...props} />);
  });

  it('renders with panel loading', () => {
    wrapper.setProps({ loading: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('renders with provider and status section', () => {
    wrapper.setProps({
      cert: 'abc==',
      enabled: true,
      loading: false,
      provider: 'https://sso.sparkpost.com/redirect',
      updateError: 'Oh no!',
      updatedAt: '2018-09-11T19:39:06+00:00'
    });
    expect(wrapper).toMatchSnapshot();
  });

  it('renders with tfaRequired', () => {
    wrapper.setProps({ tfaRequired: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('calls getAccountSingleSignOnDetails when mounted', () => {
    expect(props.getAccountSingleSignOnDetails).toHaveBeenCalled();
  });
});
