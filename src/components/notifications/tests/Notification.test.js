import React from 'react';
import { shallow } from 'enzyme';
import Notification from '../Notification';

describe('Component: Notification', () => {
  let props;
  let wrapper;

  beforeEach(() => {
    props = {
      component: () => 'Test Content',
      title: 'A Title',
      activeDate: '2018-06-04T12:00:00.000-04:00',
      unread: false
    };

    wrapper = shallow(<Notification {...props} />);
  });

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should add unread class to title if unread', () => {
    wrapper.setProps({ unread: true });
    expect(wrapper).toMatchSnapshot();
  });
});
