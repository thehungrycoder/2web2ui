import React from 'react';
import { shallow } from 'enzyme';
import { WebhookForm } from '../WebhookForm';
import SubaccountSection from '../SubaccountSection';

describe('Webhooks Form Component', () => {
  let wrapper;
  const props = {
    handleSubmit: jest.fn(),
    submitting: false,
    pristine: true,
    auth: null,
    eventsTree: [],
    eventsRadio: 'all',
    hasSubaccounts: false,
    newWebhook: false
  };

  beforeEach(() => {
    wrapper = shallow(<WebhookForm {...props} />);
  });

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should handle submit', () => {
    wrapper.find('form').simulate('submit');
    expect(props.handleSubmit).toHaveBeenCalled();
  });

  it('should subaccount section if subaccounts exist', () => {
    wrapper.setProps({ hasSubaccounts: true });
    expect(wrapper.find(SubaccountSection)).toMatchSnapshot();
  });

  it('should show events checkboxes', () => {
    wrapper.setProps({ eventsRadio: 'select' });
    // Ghetto sibling selector
    // 'Grid' below radio group is the checkbox group
    expect(wrapper.find('EventsRadioGroup').parent().props().children).toMatchSnapshot();
  });

  describe('submit button props', () => {
    it('should render update and disabled by default', () => {
      expect(wrapper.find('Button').props().children).toEqual('Update Webhook');
      expect(wrapper.find('Button').props().disabled).toBe(true);
    });

    it('should render submitting state correctly', () => {
      wrapper.setProps({ submitting: true });
      expect(wrapper.find('Button').props().children).toEqual('Submitting...');
      expect(wrapper.find('Button').props().disabled).toBe(true);
    });

    it('should render create and dirt state correctly', () => {
      wrapper.setProps({ newWebhook: true, pristine: false });
      expect(wrapper.find('Button').props().children).toEqual('Create Webhook');
      expect(wrapper.find('Button').props().disabled).toBe(false);
    });
  });

  describe('auth', () => {
    it('should render basic auth fields', () => {
      wrapper.setProps({ auth: 'basic' });
      expect(wrapper.find('AuthDropDown').parent().props().children).toMatchSnapshot();
    });

    it('should render basic oauth2 fields', () => {
      wrapper.setProps({ auth: 'oauth2' });
      expect(wrapper.find('AuthDropDown').parent().props().children).toMatchSnapshot();
    });
  });
});
