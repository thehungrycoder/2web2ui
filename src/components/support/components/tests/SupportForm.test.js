import React from 'react';
import { shallow } from 'enzyme';
import * as fileHelpers from 'src/helpers/file';

import { SupportForm } from '../SupportForm';

jest.mock('src/helpers/file');

describe('Support Form Component', () => {
  let wrapper;
  const technicalIssue = {
    id: 'technical_issues',
    label: 'I need help!',
    messageLabel: 'Tell use more about your technical issue',
    type: 'Support'
  };

  describe('Form', () => {
    let props;
    let handleSubmit;

    beforeEach(() => {
      handleSubmit = jest.fn();
      props = { handleSubmit, issues: [technicalIssue]};
      wrapper = shallow(<SupportForm {...props} />);
    });

    it('should render', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('should render the form by default', () => {
      expect(wrapper.find('form').exists()).toBeTruthy();
      expect(wrapper.find('h6').text()).toMatch(/Submit A Support Ticket/);
    });

    it('should not render the form on success', () => {
      const successProps = { ...props, submitSucceeded: true };

      wrapper = shallow(<SupportForm {...successProps} />);
      expect(wrapper.find('form').exists()).toBeFalsy();
    });

    it('should render message on success', () => {
      wrapper = shallow(<SupportForm {...props} submitSucceeded={true} />);
      expect(wrapper.find('h6').text()).toMatch(/Has Been Submitted/);
    });

    it('should not render message on failure', () => {
      wrapper = shallow(<SupportForm {...props} submitFailed={true} />);
      expect(wrapper.find('h6').text()).not.toMatch(/Has Been Submitted/);
    });

    it('should render with selected issue message label', () => {
      wrapper.setProps({ selectedIssue: technicalIssue });
      expect(wrapper).toMatchSnapshot();
    });

    it('should render issue dropdown with help text', () => {
      wrapper.setProps({ needsOnlineSupport: true });
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('Control', () => {
    let props;
    let wrapper;

    beforeEach(() => {
      props = {
        issues: [technicalIssue],
        createTicket: jest.fn(),
        handleSubmit: jest.fn(),
        reset: jest.fn(),
        onCancel: jest.fn(),
        onContinue: jest.fn()
      };
      wrapper = shallow(<SupportForm {...props} />);
    });

    it('should call parent on cancel', () => {
      wrapper.instance().reset(props.onCancel);
      expect(props.onCancel).toHaveBeenCalled();
    });

    it('should call parent on continue', () => {
      wrapper.instance().reset(props.onContinue);
      expect(props.onContinue).toHaveBeenCalled();
    });

    it('should cancel', () => {
      const spy = jest.spyOn(wrapper.instance(), 'reset');
      const btns = wrapper.find('Button');
      expect(btns).toHaveLength(2);
      btns.at(1).simulate('click');
      expect(spy).toHaveBeenCalled();
      expect(props.onCancel).toHaveBeenCalled();
    });

    it('should continue', () => {
      props = { ...props, submitSucceeded: true };
      wrapper = shallow(<SupportForm {...props} />);
      const spy = jest.spyOn(wrapper.instance(), 'reset');
      wrapper.find('Button').simulate('click');
      expect(spy).toHaveBeenCalled();
      expect(props.onContinue).toHaveBeenCalled();
    });

    it('should submit a ticket', async () => {
      const values = {
        issueId: 'technical_issues',
        message: 'I was not able to send an email!'
      };

      await wrapper.instance().onSubmit(values);

      expect(props.createTicket).toHaveBeenCalledWith({
        issueType: technicalIssue.type,
        subject: technicalIssue.label,
        message: values.message
      });
    });

    it('should submit a ticket with an attachment', async () => {
      const values = {
        issueId: 'technical_issues',
        message: 'I was not able to send an email!',
        attachment: {
          name: 'example.png'
        }
      };
      const encoded = btoa('attachment://body');

      fileHelpers.getBase64Contents = jest.fn(() => Promise.resolve(encoded));

      await wrapper.instance().onSubmit(values);

      expect(fileHelpers.getBase64Contents).toHaveBeenCalledWith(values.attachment);
      expect(props.createTicket).toHaveBeenCalledWith({
        issueType: technicalIssue.type,
        subject: technicalIssue.label,
        message: values.message,
        attachment: {
          filename: values.attachment.name,
          content: encoded
        }
      });
    });
  });
});
