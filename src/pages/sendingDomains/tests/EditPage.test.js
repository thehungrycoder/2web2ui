import { shallow } from 'enzyme';
import React from 'react';

import { EditPage } from '../EditPage';

describe('Sending Domains Edit Page', () => {
  let wrapper;

  const domain = {
    id: 'abcd.com',
    tracking_domain: 'track.me',
    subaccount_id: 100
  };

  beforeEach(() => {
    const props = {
      domain,
      getError: null,
      getLoading: false,
      getDomain: jest.fn(),
      match: {
        params: { id: 'abcd.com' }
      }
    };

    wrapper = shallow(<EditPage {...props}/>);
  });

  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().props.getDomain).toHaveBeenCalledTimes(1);
  });

  it('renders loading correctly', () => {
    wrapper.setProps({ domain: { id: 'foobar.com' }});
    expect(wrapper).toMatchSnapshot();
  });

  it('renders error banner correctly', () => {
    wrapper.setProps({ getError: { message: 'error' }});
    expect(wrapper).toMatchSnapshot();
  });
});
