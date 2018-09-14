import { shallow } from 'enzyme';
import React from 'react';
import User from '../User';

describe('Component: User', () => {

  let props;
  let wrapper;

  beforeEach(() => {
    props = {
      name: 'foo bar',
      email: 'foo@bar.com',
      username: 'foo-bar'
    };
    wrapper = shallow(<User {...props} />);
  });

  it('renders name & email & username link', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
