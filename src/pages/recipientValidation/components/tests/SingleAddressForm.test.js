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

  it('should hide previous errors preSubmit', async () => {
    props.submitFailed = false;
    props.errors = {
      payload: {
        message: 'hide me'
      }
    };
    wrapper.setProps(props);
    wrapper.find('form').simulate('submit', formValues);
    expect(props.singleAddress.mock.calls).toMatchSnapshot();
  });

  it('should show errors if submit failed', async () => {
    props.submitFailed = true;
    props.errors = {
      payload: {
        message: 'show me'
      }
    };
    wrapper.setProps(props);
    wrapper.find('form').simulate('submit', formValues);
    expect(props.singleAddress.mock.calls).toMatchSnapshot();
  });

  it('should display invalid address result', async () => {
    props.results = {
      invalid: true,
      reason: 'why'
    };
    wrapper.setProps(props);
    wrapper.find('form').simulate('submit', formValues);
    expect(props.singleAddress.mock.calls).toMatchSnapshot();
  });

  it('should display valid address result', async () => {
    props.results = {
      valid: true
    };
    wrapper.setProps(props);
    wrapper.find('form').simulate('submit', formValues);
    expect(props.singleAddress.mock.calls).toMatchSnapshot();
  });

  it('should trim email value', () => {
    expect(wrapper.find('Field').props().normalize('  test  ')).toBe('test');
  });
});
