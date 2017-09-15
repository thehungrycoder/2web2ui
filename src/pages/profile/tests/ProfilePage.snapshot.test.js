import { shallow } from 'enzyme';
import React from 'react';

import { ProfilePage } from '../ProfilePage';

const props = {
  currentUser: {
    username: 'Lord Stark',
    email: 'ned.stark@winterfell.biz',
    customer: 12345
  }
};

let wrapper;

beforeEach(() => {
  wrapper = shallow(<ProfilePage {...props} />);
});

it('renders correctly', () => {
  expect(wrapper).toMatchSnapshot();
});
