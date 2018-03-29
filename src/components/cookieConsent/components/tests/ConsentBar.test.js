import React from 'react';
import { shallow, mount } from 'enzyme';

import { ConsentBar } from '../ConsentBar';

describe('ConsentBar', () => {
  let props;

  beforeEach(() => {
    props = { onDismiss: jest.fn() };
  });

  it('should render correctly', () => {
    expect(shallow(<ConsentBar {...props} />)).toMatchSnapshot();
  });

  it('should wire up onDismiss', () => {
    const wrapper = mount(<ConsentBar {...props} />);
    wrapper.find('a').at(1).simulate('click');
    expect(props.onDismiss).toHaveBeenCalled();
  });
});

