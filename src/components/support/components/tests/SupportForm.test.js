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
    type: 'Support',
    isHeroku: false
  };

  describe('Form', () => {
    let props;

    beforeEach(() => {

      props = {
        handleSubmit: jest.fn(),
        issues: [technicalIssue],
        toggleSupportPanel: jest.fn()
      };
      wrapper = shallow(<SupportForm {...props} />);
    });

    it('should render support form', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('should render successfully created ticket message', () => {
      wrapper.setProps({ submitSucceeded: true, ticketId: 123 });
      expect(wrapper).toMatchSnapshot();
    });

    it('should render with selected issue message label', () => {
      wrapper.setProps({ selectedIssue: technicalIssue });
      expect(wrapper).toMatchSnapshot();
    });

    it('should render issue dropdown with help text', () => {
      wrapper.setProps({ needsOnlineSupport: true });
      expect(wrapper.find('Field[name="issueId"]')).toMatchSnapshot();
    });

    it('should render unauthorized message', () => {
      wrapper.setProps({ notAuthorizedToSubmitSupportTickets: true });
      expect(wrapper).toMatchSnapshot();
    });

    it('should render heroku message', () => {
      wrapper.setProps({ isHeroku: true });
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
        onClose: jest.fn(),
        openSupportPanel: jest.fn()
      };
      wrapper = shallow(<SupportForm {...props} />);
    });

    it('should call parent on cancel', () => {
      wrapper.instance().reset(props.onClose);
      expect(props.onClose).toHaveBeenCalled();
    });

    it('should reopen support panel when no issue view is canceled', () => {
      wrapper.setProps({ notAuthorizedToSubmitSupportTickets: true });
      wrapper.find('NoIssues').simulate('cancel');

      expect(props.openSupportPanel).toHaveBeenCalled();
    });

    it('should continue', () => {
      wrapper.setProps({ submitSucceeded: true });
      wrapper.find('Button').simulate('click');
      expect(props.onClose).toHaveBeenCalled();
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
