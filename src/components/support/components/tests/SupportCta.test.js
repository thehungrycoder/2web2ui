import React from 'react';
import { shallow } from 'enzyme';

import { SupportCta } from '../SupportCta';

describe('Support CTA Component', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      toggleForm: jest.fn(),
      entitledToPhoneSupport: false
    };
    wrapper = shallow(<SupportCta {...props} />);
  });

  it('should render', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render with phone support', () => {
    wrapper.setProps({ entitledToPhoneSupport: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('should call toggleForm on button click', () => {
    wrapper.find('Button').simulate('click');
    expect(props.toggleForm).toHaveBeenCalledTimes(1);
  });
});
