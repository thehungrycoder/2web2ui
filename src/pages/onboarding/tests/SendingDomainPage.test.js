import { shallow } from 'enzyme';
import React from 'react';
import { SendingDomainPage } from '../SendingDomainPage';
import { SubmissionError } from 'redux-form';
import * as analytics from 'src/helpers/analytics';
import * as constants from 'src/constants';
import { UnstyledLink } from '@sparkpost/matchbox';

jest.mock('src/helpers/analytics');

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

  it('should track learn more link clicks', () => {
    wrapper.find(UnstyledLink).simulate('click');
    expect(analytics.trackEvent).toHaveBeenCalledWith({
      category: constants.ANALYTICS_ONBOARDING,
      action: constants.ANALYTICS_ONBOARDING_LEARN_MORE,
      data: { action: constants.ANALYTICS_ONBOARDING_LEARN_MORE }
    });
  });

  it('should render submitting state correctly', () => {
    wrapper.setProps({ submitting: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('should call submit function on form submit', () => {
    wrapper.find('form').simulate('submit');
    expect(props.handleSubmit).toHaveBeenCalledWith(wrapper.instance().handleDomainCreate);
  });

  it('should handle submit success correctly', async () => {
    wrapper.setProps({ createDomain: jest.fn(() => Promise.resolve()) });
    await wrapper.instance().handleDomainCreate('values');
    expect(wrapper.instance().props.createDomain).toHaveBeenCalledWith('values');
  });

  it('should redirect on submit success', () => {
    wrapper.setProps({ submitSucceeded: true });
    expect(wrapper.instance().props.history.push).toHaveBeenCalledWith('/onboarding/email');
  });

  it('should track success', () => {
    wrapper.setProps({ submitSucceeded: true });
    expect(analytics.trackEvent).toHaveBeenCalledWith({
      category: constants.ANALYTICS_ONBOARDING,
      action: constants.ANALYTICS_ONBOARDING_CREATE_DOMAIN,
      data: { action: constants.ANALYTICS_ONBOARDING_CREATE_DOMAIN }
    });
  });

  it('should handle submit failure correctly', async () => {
    wrapper.setProps({ createDomain: jest.fn(() => Promise.reject(new Error('Oh no!'))) });
    await expect(wrapper.instance().handleDomainCreate('values')).rejects.toThrowError(SubmissionError);
  });
});
