import React from 'react';
import { Footer } from '../Footer';
import { shallow } from 'enzyme';

describe('Footer tests', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      logout: jest.fn()
    };

    wrapper = shallow(<Footer {...props} />);
  });


  it('should render footer correctly', () => {
    expect(wrapper).toMatchSnapshot();

  });

  it('should call logout on click', () => {
    wrapper.find('a').at(1).simulate('click');
    expect(wrapper.instance().props.logout).toHaveBeenCalled();
  });
});
