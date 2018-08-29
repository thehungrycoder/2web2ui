import { shallow } from 'enzyme';
import React from 'react';
import User from '../User';

describe('Component: User', () => {

  let props;
  let wrapper;

  beforeEach(() => {
    props = {
      name: 'foo bar',
      email: 'foo@bar.com'
    };
    wrapper = shallow(<User {...props} />);
  });

  it('renders name & email', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
