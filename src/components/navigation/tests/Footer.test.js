import React from 'react';
import { Footer } from '../Footer';
import { shallow } from 'enzyme';

describe('Footer tests', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      logout: jest.fn(),
      currentUser: { access_level: 'user' }
    };

    wrapper = shallow(<Footer {...props} />);
  });


  it('should render footer correctly for non-heroku user', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should not render docs or logout for heroku user', () => {
    props.currentUser.access_level = 'heroku';
    wrapper = shallow(<Footer {...props} />);

    expect(wrapper).toMatchSnapshot();
  });

  it('should call logout on click', () => {
    wrapper.find('UnstyledLink').at(1).simulate('click');
    expect(wrapper.instance().props.logout).toHaveBeenCalled();
  });
});
