import React from 'react';
import { shallow } from 'enzyme';
import { ListPage } from '../ListPage';
import TimeAgo from 'react-timeago';

describe('Page: Users List', () => {

  let props;
  let wrapper;
  let instance;

  beforeEach(() => {
    props = {
      loading: false,
      listUsers: jest.fn(),
      users: [
        { name: 'Test User 1', access: 'admin', email: 'user1@test.com', tfa_enabled: false },
        { name: 'Test User 2', access: 'admin', email: 'user2@test.com', tfa_enabled: true }
      ]
    };
    wrapper = shallow(<ListPage {...props} />);
    instance = wrapper.instance();
  });

  it('should render correctly by default', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render with an error', () => {
    wrapper.setProps({
      error: {
        message: 'Uh oh! It broke.'
      }
    });
    expect(wrapper).toMatchSnapshot();
  });

  it('should transform row data for the table collection', () => {
    const row = instance.getRowData({
      name: 'test-name',
      isCurrentUser: false,
      access: 'admin',
      email: 'testemail',
      tfa_enabled: false
    });

    expect(row).toMatchSnapshot();
  });

  it('should transform row data for the table collection, with a last login date', () => {
    const row = instance.getRowData({
      name: 'test-name',
      isCurrentUser: false,
      access: 'admin',
      email: 'testemail',
      last_login: new Date()
    });

    const wrapper = shallow(<div>{row[3]}</div>);
    const timeAgoProps = wrapper.find(TimeAgo).props();
    expect(timeAgoProps.date).toBeInstanceOf(Date);
    expect(timeAgoProps.live).toEqual(false);
  });

});
