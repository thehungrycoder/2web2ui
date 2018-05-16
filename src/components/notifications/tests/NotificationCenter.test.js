import React from 'react';
import { shallow } from 'enzyme';
import { NotificationCenter } from '../NotificationCenter';

describe('Component: NotificationCenter', () => {

  let props;
  let wrapper;

  beforeEach(() => {
    const NotificationComponent = () => <p>A notification!</p>;
    props = {
      loadNotifications: jest.fn(),
      notifications: [
        {
          component: NotificationComponent,
          id: 'notification-1',
          meta: {
            title: 'An unread informational notification',
            type: 'info',
            unread: true
          }
        },
        {
          component: NotificationComponent,
          id: 'notification-2',
          meta: {
            // an already-read warning notification with no title
            type: 'warning',
            unread: false
          }
        }
      ],
      unreadCount: 1
    };

    wrapper = shallow(<NotificationCenter {...props} />);
  });

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render with no unread notifications', () => {
    wrapper.setProps({ unreadCount: 0 });
    expect(wrapper).toMatchSnapshot();
  });

  it('should render with no notifications', () => {
    wrapper.setProps({ notifications: [], unreadCount: 0 });
    expect(wrapper).toMatchSnapshot();
  });

});
