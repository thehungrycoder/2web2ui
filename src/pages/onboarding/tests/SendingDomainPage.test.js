import { shallow } from 'enzyme';
import React from 'react';
import { SendingDomainPage } from '../SendingDomainPage';
import { SubmissionError } from 'redux-form';

describe('SendingDomainPage', () => {
  let wrapper;

  const props = {
    handleSubmit: jest.fn(),
    createDomain: jest.fn(),
    showAlert: jest.fn(),
    submitting: false,
    submitSucceeded: false,
    history: {
      push: jest.fn()
    }
  };

  beforeEach(() => {
    wrapper = shallow(<SendingDomainPage {...props}/>);
  });

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render submitting state correctly', () => {
    wrapper.setProps({ submitting: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('should call submit function on form submit', () => {
    wrapper.find('form').simulate('submit');
    expect(props.handleSubmit).toHaveBeenCalledWith(wrapper.instance().handleDomainCreate);
  });

  it('should handle submit success correctly', async() => {
    wrapper.setProps({ createDomain: jest.fn(() => Promise.resolve()) });
    await wrapper.instance().handleDomainCreate('values');
    expect(wrapper.instance().props.createDomain).toHaveBeenCalledWith('values');
  });

  it('should redirect on submit success', () => {
    wrapper.setProps({ submitSucceeded: true });
    expect(wrapper.instance().props.history.push).toHaveBeenCalledWith('/onboarding/email');
  });

  it('should handle submit failure correctly', async() => {
    wrapper.setProps({ createDomain: jest.fn(() => Promise.reject(new Error('Oh no!'))) });
    await expect(wrapper.instance().handleDomainCreate('values')).rejects.toThrowError(SubmissionError);
    expect(wrapper.instance().props.showAlert).toHaveBeenCalledWith({ type: 'error', message: 'Could not add domain', details: 'Oh no!' });
  });
});
