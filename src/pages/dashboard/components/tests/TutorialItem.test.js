import { shallow } from 'enzyme';
import React from 'react';

import TutorialItem from '../TutorialItem';

describe('Component: TutorialItem', () => {
  const props = {
    label: 'my item',
    completed: false,
    children: ['Evie', 'Levon']
  };

  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<TutorialItem {...props} />);
  });

  it('should render correctly by default', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should show checkmark when task is completed', () => {
    wrapper.setProps({ completed: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('should ignore a label link and children when the item is completed', () => {
    wrapper.setProps({ labelLink: '/go/to/here', completed: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('should render the link and children when not completed', () => {
    wrapper.setProps({ labelLink: '/go/to/here' });
    expect(wrapper).toMatchSnapshot();
  });

});
