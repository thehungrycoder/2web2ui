import React from 'react';

import { shallow } from 'enzyme';

import { SingleAddressForm } from '../SingleAddressForm';

describe('SingleAddressForm', () => {
  let props;
  let formValues;
  let wrapper;

  beforeEach(() => {
    props = {
      handleSubmit: jest.fn((a) => a),
      singleAddress: jest.fn()
    };

    wrapper = shallow(<SingleAddressForm {...props} />);

    formValues = {
      address: 'foo@address.com'
    };
  });

  it('renders correctly', () => {
    wrapper.setProps(props);
    expect(wrapper).toMatchSnapshot();
  });

  it('should disable form elements on submit', () => {
    const wrapper = shallow(<SingleAddressForm submitting={true} {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should submit single email address', async () => {
    wrapper.setProps(props);
    wrapper.find('form').simulate('submit', formValues);
    expect(props.singleAddress.mock.calls).toMatchSnapshot();
  });
});
