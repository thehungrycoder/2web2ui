import { shallow } from 'enzyme';
import React from 'react';
import StatusFields from '../StatusFields';

describe('Status Fields Component', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      diabled: false
    };
    wrapper = shallow(<StatusFields {...props} />);
  });

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should disable fields correctly', () => {
    wrapper.setProps({ disabled: true });
    expect(wrapper).toMatchSnapshot();
  });
});
