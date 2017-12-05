import { shallow } from 'enzyme';
import React from 'react';

import TutorialItem from '../TutorialItem';

describe('Component: TutorialItem', () => {
  const props = {
    label: 'my item',
    children: ['Evie', 'Levon']
  };

  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<TutorialItem {...props} />);
  });

  it('should show default email banner', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should show checkmark when task is completed', () => {
    wrapper.setProps({ completed: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('should provide a link on a label', () => {
    wrapper.setProps({ labelLink: '/go/to/here' });
    expect(wrapper).toMatchSnapshot();

  });

});
