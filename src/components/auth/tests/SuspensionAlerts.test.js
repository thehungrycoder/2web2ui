import React from 'react';
import { shallow } from 'enzyme';
import { SuspensionAlerts } from '../SuspensionAlerts';

describe('Component: SuspensionAlerts', () => {
  let wrapper;
  let props;

  beforeEach(() => {


    props = {
      status: null,
      showAlert: jest.fn(),
      isSuspendedForBilling: false,
      openSupportPanel: jest.fn(),
      hydrateTicketForm: jest.fn()
    };

    wrapper = shallow(<SuspensionAlerts {...props} />);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders correctly', () => {
    expect(wrapper.html()).toEqual(null);
  });

  it('should open ticket form', () => {
    wrapper.instance().openTicket();
    expect(props.openSupportPanel).toHaveBeenCalledWith({ view: 'ticket' });
    expect(props.hydrateTicketForm).toHaveBeenCalledWith({ issueId: 'account_suspension' });
  });

  describe('componentDidUpdate', () => {
    it('should show suspension alert if account suspended', async () => {
      wrapper.setProps({ status: 'suspended' });
      wrapper.update();
      expect(props.showAlert.mock.calls[0]).toMatchSnapshot();
    });

    it('should show suspension alert if account suspended for billing', async () => {
      wrapper.setProps({ status: 'suspended', isSuspendedForBilling: true });
      wrapper.update();
      expect(props.showAlert.mock.calls[0]).toMatchSnapshot();
    });

    it('should not show suspension alert unless suspended', async () => {
      wrapper.setProps({ status: 'active' });
      wrapper.update();
      expect(props.showAlert).not.toHaveBeenCalled();
    });
  });
});
