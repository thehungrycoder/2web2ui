import { shallow } from 'enzyme';
import React from 'react';
import { Button } from '@sparkpost/matchbox';
import DeleteButton from '../DeleteButton';

describe('Component: User Page DeleteButton', () => {

  let props;
  let wrapper;

  beforeEach(() => {
    props = {
      name: 'delete-button-name'
    };
    wrapper = shallow(<DeleteButton {...props} />);
  });

  it('should render correctly by default', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render when disabled', () => {
    wrapper.setProps({ disabled: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('should handle a click', () => {
    const e = {};
    const onClick = jest.fn();
    wrapper.setProps({ onClick });
    wrapper.find(Button).simulate('click', e);
    expect(onClick).toHaveBeenCalledWith('delete-button-name');
  });

});
