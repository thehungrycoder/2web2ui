import React from 'react';
import { shallow } from 'enzyme';
import { SupportTicketLink } from '../SupportTicketLink';

describe('SupportTicketLink', () => {
  it('should render an unstyled link with a click handler', () => {
    const wrapper = shallow(<SupportTicketLink>Click Me</SupportTicketLink>);
    expect(wrapper).toMatchSnapshot();
  });

  describe('when clicked', () => {
    const props = { openSupportTicketForm: jest.fn(), issueId: 'example_issue' };
    const wrapper = shallow(<SupportTicketLink {...props}>Click Me</SupportTicketLink>);

    it('should call openSupportTicketForm', () => {
      wrapper.simulate('click');
      expect(props.openSupportTicketForm).toHaveBeenCalledWith({ issueId: 'example_issue' });
    });
  });
});
