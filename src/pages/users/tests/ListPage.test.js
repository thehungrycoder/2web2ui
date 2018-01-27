import React from 'react';
import { shallow } from 'enzyme';
import { ListPage } from '../ListPage';
import { renderRowData } from 'src/__testHelpers__/renderHelpers';
import utc from 'src/__testHelpers__/time';

describe('Page: Users List', () => {

  let props;
  let wrapper;
  let instance;

  beforeEach(() => {
    props = {
      loading: false,
      listUsers: jest.fn(),
      users: [
        { name: 'Test User 1', access: 'admin', email: 'user1@test.com' },
        { name: 'Test User 2', access: 'admin', email: 'user2@test.com' }
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
      last_login: utc({ year: 2017, month: 12, day: 15, hour: 12 })
    });

    expect(renderRowData(row)).toMatchSnapshot();
  });

});
