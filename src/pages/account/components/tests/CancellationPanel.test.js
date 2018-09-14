import React from 'react';
import { shallow } from 'enzyme';
import { CancellationPanel } from '../CancellationPanel';

describe('CancellationPanel', () => {
  it('renders', () => {
    const wrapper = shallow(<CancellationPanel />);
    expect(wrapper).toMatchSnapshot();
  });

  it('opens support ticket form when request link is clicked', () => {
    const openSupportTicketForm = jest.fn();
    const wrapper = shallow(<CancellationPanel openSupportTicketForm={openSupportTicketForm} />);

    wrapper.find('UnstyledLink').simulate('click');

    expect(openSupportTicketForm).toHaveBeenCalledWith({ issueId: expect.any(String) });
  });
});
