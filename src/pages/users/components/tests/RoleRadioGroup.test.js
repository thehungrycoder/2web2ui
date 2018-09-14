import { shallow } from 'enzyme';
import React from 'react';
import RoleRadioGroup from '../RoleRadioGroup';

describe('Component: RoleRadioGroup', () => {

  it('should render the RadioGroup', () => {
    const wrapper = shallow(<RoleRadioGroup />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render disabled', () => {
    const props = { disabled: true };
    const wrapper = shallow(<RoleRadioGroup {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render super user', () => {
    const props = { allowSuperUser: true };
    const wrapper = shallow(<RoleRadioGroup {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
