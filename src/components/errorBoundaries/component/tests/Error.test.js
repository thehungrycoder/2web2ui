import { shallow } from 'enzyme';
import React from 'react';
import Error from '../Error';

describe('Component: Error', () => {
  let wrapper;
  let props;
  beforeEach(() => {
    props = {
      message: '',
      primaryAction: null
    };
  });

  beforeEach(() => {
    wrapper = shallow(<Error {...props} />);
  });

  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('renders correctly with custom message', () => {
    wrapper.setProps({ message: 'fooooo' });
    expect(wrapper).toMatchSnapshot();
  });

  it('renders correctly with actions', () => {
    wrapper.setProps({ primaryAction: { content: 'Reload' }});
    expect(wrapper).toMatchSnapshot();
  });

});
