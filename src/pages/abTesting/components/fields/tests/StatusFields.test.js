import { shallow } from 'enzyme';
import React from 'react';
import StatusFields from '../StatusFields';

describe('Status Fields Component', () => {
  let wrapper;
  const props = {
    diabled: false
  };

  beforeEach(() => {
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
