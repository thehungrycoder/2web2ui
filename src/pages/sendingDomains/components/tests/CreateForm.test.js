import { shallow } from 'enzyme';
import React from 'react';
import { CreateForm } from '../CreateForm';

describe('Sending Domains Create Form', () => {
  let wrapper;

  const props = {
    submitting: false,
    handleSubmit: jest.fn()
  };

  beforeEach(() => {
    wrapper = shallow(<CreateForm {...props} />);
  });

  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('submits correctly', () => {
    wrapper.find('form').simulate('submit');
    expect(props.handleSubmit).toHaveBeenCalled();
  });

  it('renders submitting state correctly', () => {
    wrapper.setProps({ submitting: true });
    expect(wrapper).toMatchSnapshot();
  });
});
