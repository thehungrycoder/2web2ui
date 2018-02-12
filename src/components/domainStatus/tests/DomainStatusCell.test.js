import React from 'react';
import { shallow } from 'enzyme';

import DomainStatusCell from '../DomainStatusCell';

describe('DomainStatusCell component', () => {
  let wrapper;

  beforeEach(() => {
    const props = {
      domain: {
        status: {
          ownership_verified: null
        },
        is_default_bounce_domain: true
      }
    };

    wrapper = shallow(<DomainStatusCell {...props} />);

  });

  it('renders domain status tag if not verified', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('renders ready for tag when verified', () => {
    wrapper.setProps({ domain: { status: { ownership_verified: true, compliance_status: 'valid' }}});
    expect(wrapper).toMatchSnapshot();
  });
});
